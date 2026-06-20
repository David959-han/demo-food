import type { AppNotification } from '@/types/notification';

const raw = () => import('@/data/management/notifications.json');

let _cache: AppNotification[] | null = null;

export async function getNotifications(): Promise<AppNotification[]> {
  if (_cache) return _cache;
  const mod = await raw();
  _cache = mod.default as AppNotification[];
  return _cache;
}
