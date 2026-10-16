// Keep in sync with simulator/server.py

export const SERVICE_UUID = "0c3dd43a-2b58-4ad5-86b9-27bf6d63010f";
export const INFO_UUID = "d9a04b8c-7374-4095-969a-62d78707f7d4";
export const EVENTS_UUID = "76c44341-bfdc-4a69-aac9-0f8b07ba4c5d";
export const COMMANDS_UUID = "9754faf3-c6f7-4d08-a74c-ef99470a9dd1";
export const STATUS_UUID = "726b0cda-8db7-4e25-bd0d-5b3210c22653";

export const PROTOCOL_VERSION = 1;
export const PACKET_SIZE = 6;
export const WIN_SCORE = 8;

export const EventType = {
  Shot: 1,
  Potted: 2,
  Foul: 3,
  TurnChange: 4,
  GameOver: 5,
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export const TableStatus = {
  Idle: 0,
  InGame: 1,
} as const;
export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

export const Command = {
  StartGame: 1,
  Reset: 2,
} as const;
export type Command = (typeof Command)[keyof typeof Command];

export interface TableEvent {
  type: EventType;
  seq: number; // 16 bit, wraps from 65535 to 0
  player: number;
  value: number;
  flags: number;
}