# Chalk

A React Native player app for booking and playing at a pool venue. You browse tables, book a slot and pay, scan the QR code at the table to start, then play against a countdown with a frame counter.

Built over a weekend in October 2026 as a hands-on way to learn the shape of a venue booking product: a booking flow, a QR-driven game start, and a design that could be re-themed for different venues. The backend is mocked in memory, so the focus is the app, its state management and its structure.

## What it does

- **Tables:** a list of tables showing whether each is free, in use or reserved.
- **Table detail:** pick a start time and a duration, and see the price with VAT worked out.
- **Payment:** a booking summary and a pay button (mocked), followed by a confirmation screen.
- **Scan to start:** scan the table's QR code with the camera, or type the code in. The code opens that game.
- **Game:** a countdown to the booking's end time, and frame counters for each player.
- **Ranks:** a placeholder tab for a leaderboard.

## Screens and routes

Routing uses Expo Router (file-based, with typed routes).

| Route                 | File                             | Purpose                          |
| --------------------- | -------------------------------- | -------------------------------- |
| `/` (Tables tab)      | `src/app/(tabs)/index.tsx`       | Table list                       |
| `/scan` (Scan tab)    | `src/app/(tabs)/scan.tsx`        | Camera and manual code entry     |
| `/ranks` (Ranks tab)  | `src/app/(tabs)/ranks.tsx`       | Leaderboard placeholder          |
| `/table/[id]`         | `src/app/table/[id].tsx`         | Table detail and booking options |
| `/table/payment`      | `src/app/table/payment.tsx`      | Check and pay                    |
| `/table/confirmation` | `src/app/table/confirmation.tsx` | Booking confirmed                |
| `/game/[code]`        | `src/app/game/[code].tsx`        | Live game                        |

## Running it

You need Node, pnpm (the version is pinned in the root `package.json`), and either Expo Go on a device or an Android or iOS simulator.

```bash
pnpm install
pnpm --filter mobile start
```

Scan the QR code with Expo Go. The project is on Expo SDK 57, so the installed Expo Go must support that SDK. If your phone and computer are on different networks (for example when developing inside WSL), start with `--tunnel`:

```bash
pnpm --filter mobile exec expo start --tunnel
```

To try the game screen, scan or type one of the seeded booking codes from `apps/mobile/src/api/venue-api.ts`, such as `3-LYN3`.

Run the shared package tests with:

```bash
pnpm test
```

## Structure

This is a pnpm monorepo. `node-linker=hoisted` is set in `.npmrc` because Metro needs a flat `node_modules`.

```
apps/
  mobile/               Expo app (React Native, TypeScript)
    src/
      app/              Routes (Expo Router)
      api/              Mock venue API (in-memory)
      components/       table/ and game/ components
packages/
  ui-tokens/            Design tokens and themes
  core/                 Protocol types and event decoder, with tests
simulator/
  server.py             Bluetooth LE table simulator (Python)
```

## Design decisions

- **Server state and screen state are kept apart.** TanStack Query holds data that comes from the API (tables, games). Local `useState` holds what the user is choosing on a screen (start time, duration, frame counts). Values are passed down as props with callbacks passed back up. Zustand is a dependency but is reserved for state shared across screens.
- **Design tokens as data.** Colours, spacing and radii live in `packages/ui-tokens`, with two themes defined (`chalkTheme` and `neonTheme`). Screens read from the tokens and not from hard-coded values, which is what makes re-theming for another venue possible.
- **Booking and game are one record.** A game has a table, a scheduled start and end, a status, and a short readable code (for example `3-LYN3`). The same record carries a booking through payment, scanning and play.
- **The countdown is derived from a timestamp.** The game timer subtracts from the booking's end time on each tick, instead of counting down a stored number, so it stays right if the app is backgrounded.
- **Booking codes** avoid ambiguous patterns and are generated with a cryptographic random source and rejection sampling to avoid modulo bias.
- **Typed routes and the React Compiler** are switched on in `app.json`.

## Bluetooth simulator and protocol (side exploration)

`simulator/server.py` pretends to be a smart pool table over Bluetooth Low Energy, using Python's `bless` library on Windows. It exposes a custom GATT service with characteristics for table info, game events, commands and status. Events are 6-byte packets:

| Byte   | Field    | Notes                                                |
| ------ | -------- | ---------------------------------------------------- |
| 0      | type     | 1 shot, 2 potted, 3 foul, 4 turn change, 5 game over |
| 1 to 2 | sequence | 16-bit, big-endian, wraps at 65535                   |
| 3      | player   | 0 or 1                                               |
| 4      | value    | ball number or score                                 |
| 5      | flags    | reserved                                             |

`packages/core` contains the shared protocol constants and a tested encoder and decoder. To try the simulator, run it on Windows, connect with a BLE client such as nRF Connect, and write `01 00` to the commands characteristic to start a game or `02 00` to reset.

This is not connected to the app yet. The game screen's frame counters are manual for now.

## Status and known gaps

This is a work in progress, and these are the honest gaps:

- The API is in-memory and does not persist bookings. `bookTable` builds a booking but does not store it, so a new booking cannot yet be opened by its code.
- The confirmation screen does not yet show the generated booking code.
- VAT is a fixed 20% in the UI. Money maths should move into `packages/core` as integer-pence functions with tests.
- Payment is mocked. A real version would create a payment on the server, confirm it with a payments SDK on the device, and treat the server webhook as the source of truth.
- The idempotency key is generated per tap but is not yet reused across retries or checked by the mock API.
- The leaderboard is a placeholder, and the second theme is defined but not yet switchable in the app.
- No end-to-end store release has been done. An EAS project is configured, but there are no published builds or OTA updates.

## Next steps

1. Persist bookings in the mock API and show the code on the confirmation screen.
2. Optimistic update of the table list on booking, with rollback on failure.
3. Scan error cases: unknown code, finished game, wrong table, game already started.
4. Money functions with tests in `packages/core`.
5. Wire the simulator events into the game screen through a connection layer.
6. EAS preview build and a first OTA update.
