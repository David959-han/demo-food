'use client';

import { useState, useEffect } from 'react';

/** Returns elapsed seconds since `createdAt`, updates every second. */
export function useElapsedSeconds(createdAt: string): number {
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)),
  );

  useEffect(() => {
    const origin = new Date(createdAt).getTime();
    const id = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - origin) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  return elapsed;
}

/** Format seconds → "MM:SS" */
export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Color class based on elapsed minutes */
export function timerColorClass(seconds: number): string {
  const minutes = seconds / 60;
  if (minutes < 10) return 'text-(--success-400)';
  if (minutes < 20) return 'text-(--warning-400)';
  return 'text-(--danger-400)';
}

/** Background glow class based on elapsed minutes */
export function timerBgClass(seconds: number): string {
  const minutes = seconds / 60;
  if (minutes < 10) return '';
  if (minutes < 20) return 'ring-1 ring-(--warning-500)/30';
  return 'ring-1 ring-(--danger-500)/40';
}
