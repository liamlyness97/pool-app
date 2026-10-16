// packages/core/src/decoder.ts
import { EventType, PACKET_SIZE, type TableEvent } from "./protocol";

const EVENT_TYPE_VALUES = new Set<number>(Object.values(EventType));

function isEventType(value: number): value is EventType {
  return EVENT_TYPE_VALUES.has(value);
}

export function decodeEvent(bytes: Uint8Array): TableEvent {
  if (!bytes || bytes.length !== PACKET_SIZE) {
    throw new Error(
      `Invalid event packet: expected ${PACKET_SIZE} bytes, got ${bytes?.length ?? 0}`
    );
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const type = view.getUint8(0);
  if (!isEventType(type)) {
    throw new Error(`Unknown event type: ${type}`);
  }

  return {
    type,
    seq: view.getUint16(1, false), // big-endian
    player: view.getUint8(3),
    value: view.getUint8(4),
    flags: view.getUint8(5),
  };
}

export function encodeEvent(event: TableEvent): Uint8Array {
  const bytes = new Uint8Array(PACKET_SIZE);
  const view = new DataView(bytes.buffer);

  view.setUint8(0, event.type);
  view.setUint16(1, event.seq, false); // big-endian, wraps past 65535
  view.setUint8(3, event.player);
  view.setUint8(4, event.value);
  view.setUint8(5, event.flags);

  return bytes;
}