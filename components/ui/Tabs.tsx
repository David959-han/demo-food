'use client';

import {
  useState,
  useRef,
  useLayoutEffect,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  key:      string;
  label:    ReactNode;
  badge?:   string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs:         Tab[];
  activeKey?:   string;
  defaultKey?:  string;
  onChange?:    (key: string) => void;
  className?:   string;
}

export function Tabs({
  tabs,
  activeKey: controlledKey,
  defaultKey,
  onChange,
  className,
}: TabsProps) {
  const [internalKey, setInternalKey] = useState(
    defaultKey ?? tabs[0]?.key ?? '',
  );
  const isControlled = controlledKey !== undefined;
  const active = isControlled ? controlledKey : internalKey;

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current.get(active);
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  function select(key: string) {
    if (!isControlled) setInternalKey(key);
    onChange?.(key);
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        role="tablist"
        className={cn(
          'relative flex items-center gap-0.5',
          'border-b border-(--border-default)',
        )}
      >
        {/* Animated indicator */}
        <motion.span
          aria-hidden
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-0 h-0.5 bg-(--brand-500) rounded-full"
          style={{ left: indicator.left, width: indicator.width }}
        />

        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.key, el);
                else tabRefs.current.delete(tab.key);
              }}
              onClick={() => !tab.disabled && select(tab.key)}
              className={cn(
                'relative flex items-center gap-1.5 px-3 pb-3 pt-2',
                'text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-(--brand-500)/40 rounded-t-md',
                isActive
                  ? 'text-(--text-primary)'
                  : 'text-(--text-muted) hover:text-(--text-secondary)',
                tab.disabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center',
                    'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold',
                    isActive
                      ? 'bg-(--brand-500) text-white'
                      : 'bg-(--bg-subtle) text-(--text-muted)',
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
