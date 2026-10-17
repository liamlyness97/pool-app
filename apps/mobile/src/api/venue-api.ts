export type TableStatus = "free" | "in_use" | "reserved";

export interface VenueTable {
    id: string;
    name: string;
    kind: "Pool" | "Snooker";
    size: string;
    status: TableStatus;
    note?: string;
}

const TABLES: VenueTable[] = [
  { id: "1", name: "Table 1", kind: "Pool", size: "8ft", status: "free" },
  { id: "2", name: "Table 2", kind: "Pool", size: "8ft", status: "in_use", note: "18 min left" },
  { id: "3", name: "Table 3", kind: "Pool", size: "9ft", status: "free" },
  { id: "4", name: "Table 4", kind: "Pool", size: "9ft", status: "reserved", note: "from 20:30" },
  { id: "5", name: "Table 5", kind: "Snooker", size: "10ft", status: "free" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTables(): Promise<VenueTable[]> {
    await wait(500);
    return TABLES
}