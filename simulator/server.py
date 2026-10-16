"""Rackup table simulator.

Advertises a BLE service that behaves like a smart pool table:
  - Table info  (read):          protocol version, table id, table name
  - Game events (read, notify):  6-byte packets, see pack_event()
  - Commands    (write):         2 bytes: command, argument
  - Status      (read, notify):  1 byte: 0 idle, 1 in game

Run on Windows (not WSL) so it can use the PC's Bluetooth adapter.
"""

import asyncio
import logging
import random
import struct
from typing import Any

from bless import (
    BlessGATTCharacteristic,
    BlessServer,
    GATTAttributePermissions,
    GATTCharacteristicProperties,
)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("rackup-sim")

# ---------------------------------------------------------------------------
# Protocol constants. Keep these in sync with packages/core in the monorepo.
# ---------------------------------------------------------------------------
SERVICE_UUID = "0C3DD43A-2B58-4AD5-86B9-27BF6D63010F"
INFO_UUID = "D9A04B8C-7374-4095-969A-62D78707F7D4"
EVENTS_UUID = "76C44341-BFDC-4A69-AAC9-0F8B07BA4C5D"
COMMANDS_UUID = "9754FAF3-C6F7-4D08-A74C-EF99470A9DD1"
STATUS_UUID = "726B0CDA-8DB7-4E25-BD0D-5B3210C22653"

DEVICE_NAME = "Rackup Table 7"
TABLE_ID = 7
PROTOCOL_VERSION = 1

# Event types
EVT_SHOT = 1
EVT_POTTED = 2
EVT_FOUL = 3
EVT_TURN_CHANGE = 4
EVT_GAME_OVER = 5

# Status values
STATUS_IDLE = 0
STATUS_IN_GAME = 1

# Commands (first byte of a write to the commands characteristic)
CMD_START_GAME = 1  # second byte: game mode
CMD_RESET = 2

WIN_SCORE = 8


def pack_event(event_type: int, seq: int, player: int, value: int, flags: int = 0) -> bytes:
    """6 bytes: type (1), sequence (2, big endian), player (1), value (1), flags (1)."""
    return struct.pack(">BHBBB", event_type, seq & 0xFFFF, player, value, flags)


class Table:
    def __init__(self, server: BlessServer) -> None:
        self.server = server
        self.seq = 0
        self.game_task: asyncio.Task | None = None

    def push(self, char_uuid: str, data: bytes) -> None:
        """Store a new value and notify any subscribed client."""
        self.server.get_characteristic(char_uuid).value = bytearray(data)
        self.server.update_value(SERVICE_UUID, char_uuid)

    def set_status(self, status: int) -> None:
        self.push(STATUS_UUID, bytes([status]))
        log.info("status -> %s", "in game" if status == STATUS_IN_GAME else "idle")

    def emit(self, event_type: int, player: int = 0, value: int = 0, flags: int = 0) -> None:
        data = pack_event(event_type, self.seq, player, value, flags)
        log.info("event seq=%d type=%d player=%d value=%d", self.seq, event_type, player, value)
        self.seq += 1
        self.push(EVENTS_UUID, data)

    async def play_game(self, mode: int) -> None:
        log.info("game started, mode %d", mode)
        self.set_status(STATUS_IN_GAME)
        scores = [0, 0]
        player = 0
        try:
            while max(scores) < WIN_SCORE:
                await asyncio.sleep(1.5)
                self.emit(EVT_SHOT, player)
                await asyncio.sleep(0.6)

                roll = random.random()
                if roll < 0.55:
                    # Potted: same player keeps their turn
                    scores[player] += 1
                    self.emit(EVT_POTTED, player, random.randint(1, 15))
                elif roll < 0.70:
                    self.emit(EVT_FOUL, player)
                    player = 1 - player
                    self.emit(EVT_TURN_CHANGE, player)
                else:
                    player = 1 - player
                    self.emit(EVT_TURN_CHANGE, player)

            winner = 0 if scores[0] > scores[1] else 1
            self.emit(EVT_GAME_OVER, winner, scores[winner])
        finally:
            self.set_status(STATUS_IDLE)

    def start_game(self, mode: int) -> None:
        if self.game_task and not self.game_task.done():
            log.info("start ignored, a game is already running")
            return
        self.game_task = asyncio.create_task(self.play_game(mode))

    def reset(self) -> None:
        if self.game_task and not self.game_task.done():
            self.game_task.cancel()
        log.info("reset")


async def run(loop: asyncio.AbstractEventLoop) -> None:
    commands: asyncio.Queue[tuple[int, int]] = asyncio.Queue()

    def read_request(characteristic: BlessGATTCharacteristic, **kwargs: Any) -> bytearray:
        return characteristic.value

    def write_request(characteristic: BlessGATTCharacteristic, value: Any, **kwargs: Any) -> None:
        characteristic.value = value
        if str(characteristic.uuid).upper() == COMMANDS_UUID and len(value) >= 2:
            # Callbacks may arrive on another thread, so hand over safely.
            loop.call_soon_threadsafe(commands.put_nowait, (value[0], value[1]))

    server = BlessServer(name=DEVICE_NAME, loop=loop)
    server.read_request_func = read_request
    server.write_request_func = write_request

    await server.add_new_service(SERVICE_UUID)

    info = bytes([PROTOCOL_VERSION, TABLE_ID]) + DEVICE_NAME.encode("ascii")
    await server.add_new_characteristic(
        SERVICE_UUID,
        INFO_UUID,
        GATTCharacteristicProperties.read,
        bytearray(info),
        GATTAttributePermissions.readable,
    )
    await server.add_new_characteristic(
        SERVICE_UUID,
        EVENTS_UUID,
        GATTCharacteristicProperties.read | GATTCharacteristicProperties.notify,
        bytearray(6),
        GATTAttributePermissions.readable,
    )
    await server.add_new_characteristic(
        SERVICE_UUID,
        COMMANDS_UUID,
        GATTCharacteristicProperties.write | GATTCharacteristicProperties.write_without_response,
        bytearray(2),
        GATTAttributePermissions.writeable,
    )
    await server.add_new_characteristic(
        SERVICE_UUID,
        STATUS_UUID,
        GATTCharacteristicProperties.read | GATTCharacteristicProperties.notify,
        bytearray([STATUS_IDLE]),
        GATTAttributePermissions.readable,
    )

    await server.start()
    log.info("Advertising as %r, service %s", DEVICE_NAME, SERVICE_UUID)
    log.info("From nRF Connect: write 0100 to commands to start a game, 02 00 to reset.")

    table = Table(server)
    try:
        while True:
            command, arg = await commands.get()
            if command == CMD_START_GAME:
                table.start_game(arg)
            elif command == CMD_RESET:
                table.reset()
            else:
                log.warning("unknown command %d", command)
    finally:
        table.reset()
        await server.stop()


def main() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(run(loop))
    except KeyboardInterrupt:
        log.info("stopped")


if __name__ == "__main__":
    main()