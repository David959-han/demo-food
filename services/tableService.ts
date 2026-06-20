import type { Table, TableSection, TableStatus } from '@/types';
import rawTables from '@/data/customer/tables.json';

const allTables = rawTables as unknown as Table[];

export type { TableSection, TableStatus };

export interface TableQueryOptions {
  section?: TableSection | null;
  status?:  TableStatus  | null;
}

export async function getTables(options: TableQueryOptions = {}): Promise<Table[]> {
  const { section = null, status = null } = options;

  let result = [...allTables];

  if (section !== null) {
    result = result.filter((t) => t.section === section);
  }
  if (status !== null) {
    result = result.filter((t) => t.status === status);
  }

  return result;
}

export async function getTableById(id: number): Promise<Table | null> {
  return allTables.find((t) => t.id === id) ?? null;
}
