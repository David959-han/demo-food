'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content:    ReactNode;
  children:   ReactNode;
  position?:  TooltipPosition;
  delay?:     number;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top:    'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-(--bg-subtle)',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-(--bg-subtle)',
  left:   'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-(--bg-subtle)',
  right:  'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-(--bg-subtle)',
};

const motionByPosition: Record<TooltipPosition, object> = {
  top:    { initial: { opacity: 0, y: 4  }, animate: { opacity: 1, y: 0  } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0  } },
  left:   { initial: { opacity: 0, x: 4  }, animate: { opacity: 1, x: 0  } },
  right:  { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0  } },
};

export function Tooltip({
  content,
  children,
  position  = 'top',
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const anim = motionByPosition[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            {...anim}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 pointer-events-none whitespace-nowrap',
              positionStyles[position],
            )}
          >
            <div
              className={cn(
                'px-2.5 py-1.5 rounded-md text-xs font-medium',
                'bg-(--bg-subtle) text-(--text-primary)',
                'border border-(--border-default)',
                'shadow-lg shadow-black/30',
                className,
              )}
            >
              {content}
            </div>
            <span
              className={cn(
                'absolute w-0 h-0',
                'border-4 border-solid',
                arrowStyles[position],
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
