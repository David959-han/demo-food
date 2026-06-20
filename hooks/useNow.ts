'use client';

import { useState, useEffect } from 'react';

interface NowState {
  now: Date;
  date: string;
  time: string;
  dayOfWeek: string;
}

function buildNowState(d: Date): NowState {
  return {
    now: d,
    date: d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export function useNow(intervalMs = 1000): NowState {
  const [state, setState] = useState<NowState>(() =>
    buildNowState(new Date()),
  );

  useEffect(() => {
    const id = setInterval(
      () => setState(buildNowState(new Date())),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [intervalMs]);

  return state;
}
