import * as Crypto from "expo-crypto";

export type TableStatus = "free" | "in_use" | "reserved";

export interface VenueTable {
    id: string;
    name: string;
    kind: "Pool" | "Snooker";
    size: string;
    status: TableStatus;
    price: number;
    note?: string;
    availability: string[];
}

export type GameStatus = 'unpaid' | 'paid' | 'reserved' | 'completed';

export interface Game {
    id: string;
    tableId: string;
    duration: number;
    startTime: string;
    started: boolean;
    code: string;
    status: GameStatus;
    ended: boolean;
    customerId: string;
}

type GameResponse = {
    game: Game;
    table: VenueTable;
}

const DIGITS = '0123456789';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomIndex(max: number): number {
    const limit = 256 - (256 % max);
    const buf = new Uint8Array(1);

    do {
        Crypto.getRandomValues(buf)
    } while (buf[0] >= limit)

    return buf[0] % max
}

function pick(chars: string): string {
    return chars[randomIndex(chars.length)]
}

export function generateCode(): string {
    const first = pick(DIGITS)
    const letters = pick(LETTERS) + pick(LETTERS) + pick(LETTERS)
    const last = pick(DIGITS);

    return `${first}-${letters}${last}`
}

const TABLES: VenueTable[] = [
  { id: "1", name: "Table 1", kind: "Pool", size: "8ft", status: "free", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'] },
  { id: "2", name: "Table 2", kind: "Pool", size: "8ft", status: "in_use", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'], note: "18 min left" },
  { id: "3", name: "Table 3", kind: "Pool", size: "9ft", status: "free", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'],},
  { id: "4", name: "Table 4", kind: "Pool", size: "9ft", status: "reserved", price: 12, availability: ['20:30', '21:00', '21:30', '22:00', '22:30'], note: "from 20:30" },
  { id: "5", name: "Table 5", kind: "Snooker", size: "10ft", status: "free", price: 17, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'], },
];

const GAMES: Game[] = [
    { id: "1", tableId: "3", duration: 2, startTime: '20:00', started: false, ended: false, code: '3-LYN3', status: 'paid', customerId: '1234' },
    { id: "2", tableId: "1", duration: 1, startTime: '19:30', started: false, ended: false, code: '4-LYN3', status: 'paid', customerId: '1234'  },
    { id: "3", tableId: "3", duration: 1, startTime: '22:00', started: false, ended: false, code: '5-LYN3', status: 'paid', customerId: '1234' },
    { id: "4", tableId: "5", duration: 3, startTime: '19:00', started: false, ended: false, code: '6-LYN3', status: 'paid', customerId: '1234' },
    { id: "5", tableId: "2", duration: 1, startTime: '21:30', started: false, ended: false, code: '7-LYN3', status: 'paid', customerId: '1234' },
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTables(): Promise<VenueTable[]> {
    await wait(500);
    return TABLES
}

export async function fetchTable(id: string): Promise<VenueTable> {
    await wait(500)

    const table = TABLES.find(table => table.id === id);
    if (!table) throw new Error (`Table ${id} not found`);
    return table
}

export async function bookTable({tableId, startTime, duration, idempotencyKey}: {tableId: string, startTime: string, duration: number, idempotencyKey: string}): Promise<string> {
    await wait(1000);

    const booking: Game = {
        id: Crypto.randomUUID(), 
        tableId: tableId, 
        duration: duration, 
        startTime: startTime, 
        started: false, 
        ended: false, 
        code: generateCode(), 
        status: 'paid', 
        customerId: '1234' 
    }

    return 'Booked'
}

export async function fetchGame({code}: {code: string}): Promise<GameResponse> {
    await wait(1000);

    const game = GAMES.find(game => game.code === code);
    if (!game) throw new Error (`Game not found`);

    const table = TABLES.find(table => table.id === game.tableId)
    if (!table) throw new Error (`Table not found`);


    return {
        game,
        table
    } 
}