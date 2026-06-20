import type { Employee } from '@/types';
import rawEmployees from '@/data/management/employees.json';

export async function getEmployees(): Promise<Employee[]> {
  return rawEmployees as unknown as Employee[];
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  const employees = await getEmployees();
  return employees.find((e) => e.id === id) ?? null;
}
