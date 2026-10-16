// packages/core/src/decoder.test.ts
import { describe, it, expect } from "vitest";
import { decodeEvent, encodeEvent } from "./decoder";
import { EventType } from "./protocol";
import type { TableEvent } from "./protocol";

describe("decodeEvent", () => {
  it("decodes a valid packet into its fields", () => {
    // type=2 (potted), seq=1, player=1, value=9, flags=0
    const bytes = new Uint8Array([0x02, 0x00, 0x01, 0x01, 0x09, 0x00]);

    expect(decodeEvent(bytes)).toEqual({
      type: EventType.Potted,
      seq: 1,
      player: 1,
      value: 9,
      flags: 0,
    });
  });

  it("reads the sequence number as big-endian", () => {
    // seq bytes 0x01 0x00 mean 256, not 1
    const bytes = new Uint8Array([0x01, 0x01, 0x00, 0x00, 0x00, 0x00]);

    expect(decodeEvent(bytes).seq).toBe(256);
  });

  it("reads the largest possible sequence number", () => {
    const bytes = new Uint8Array([0x01, 0xff, 0xff, 0x00, 0x00, 0x00]);

    expect(decodeEvent(bytes).seq).toBe(65535);
  });

  it("throws if the packet is too short", () => {
    expect(() => decodeEvent(new Uint8Array(5))).toThrow();
  });

  it("throws if the packet is empty", () => {
    expect(() => decodeEvent(new Uint8Array(0))).toThrow();
  });

  it("throws if the packet is too long", () => {
    expect(() => decodeEvent(new Uint8Array(7))).toThrow();
  });

  it("throws on an event type of 0", () => {
    const bytes = new Uint8Array([0x00, 0x00, 0x01, 0x00, 0x00, 0x00]);

    expect(() => decodeEvent(bytes)).toThrow();
  });

  it("throws on an unknown event type", () => {
    const bytes = new Uint8Array([99, 0x00, 0x01, 0x00, 0x00, 0x00]);

    expect(() => decodeEvent(bytes)).toThrow();
  });
});

describe("encodeEvent", () => {
  it("encodes an event into the expected bytes", () => {
    const event: TableEvent = {
      type: EventType.GameOver,
      seq: 258, // 0x0102
      player: 1,
      value: 8,
      flags: 0,
    };

    expect(Array.from(encodeEvent(event))).toEqual([
      0x05, 0x01, 0x02, 0x01, 0x08, 0x00,
    ]);
  });
});

describe("round trip", () => {
  it("decoding an encoded event gives back the original", () => {
    const event: TableEvent = {
      type: EventType.Foul,
      seq: 300,
      player: 0,
      value: 0,
      flags: 0,
    };

    expect(decodeEvent(encodeEvent(event))).toEqual(event);
  });
});