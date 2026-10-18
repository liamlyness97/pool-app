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

const TABLES: VenueTable[] = [
  { id: "1", name: "Table 1", kind: "Pool", size: "8ft", status: "free", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'] },
  { id: "2", name: "Table 2", kind: "Pool", size: "8ft", status: "in_use", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'], note: "18 min left" },
  { id: "3", name: "Table 3", kind: "Pool", size: "9ft", status: "free", price: 12, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'],},
  { id: "4", name: "Table 4", kind: "Pool", size: "9ft", status: "reserved", price: 12, availability: ['20:30', '21:00', '21:30', '22:00', '22:30'], note: "from 20:30" },
  { id: "5", name: "Table 5", kind: "Snooker", size: "10ft", status: "free", price: 17, availability: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'], },
];

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

export async function bookTable({tableId, startTime, hours}: {tableId: string, startTime: string, hours: number}): Promise<string> {
    await wait(1000);

    return 'Booked'
}