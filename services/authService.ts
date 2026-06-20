import rawUsers from '@/data/demoUsers.json';
import { ROLE_PERMISSIONS } from '@/types/auth';
import type { DemoUser, UserRole, PermissionKey } from '@/types/auth';

const users = rawUsers as DemoUser[];

export async function getDemoUsers(): Promise<DemoUser[]> {
  return users;
}

export async function findUser(id: number): Promise<DemoUser | null> {
  return users.find((u) => u.id === id) ?? null;
}

export async function loginAs(user: DemoUser): Promise<DemoUser> {
  return user;
}

export function hasPermission(
  user: DemoUser | null,
  permission: PermissionKey,
): boolean {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role as UserRole];
  return perms.includes('*') || (perms as string[]).includes(permission);
}
