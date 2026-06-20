'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface SearchInputProps {
  value?:        string;
  defaultValue?: string;
  onChange?:     (value: string) => void;
  onSearch?:     (value: string) => void;
  placeholder?:  string;
  debounce?:     number;
  loading?:      boolean;
  disabled?:     boolean;
  className?:    string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value:        controlledValue,
      defaultValue = '',
      onChange,
      onSearch,
      placeholder  = 'Search…',
      debounce     = 300,
      loading      = false,
      disabled     = false,
      className,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const displayValue = isControlled ? controlledValue : internal;

    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
      return () => clearTimeout(timerRef.current);
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = e.target.value;
      if (!isControlled) setInternal(val);
      onChange?.(val);

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch?.(val);
      }, debounce);
    }

    function handleClear() {
      if (!isControlled) setInternal('');
      onChange?.('');
      onSearch?.('');
    }

    const hasValue = displayValue.length > 0;

    return (
      <div className={cn('relative flex items-center', className)}>
        <span className="absolute left-3 flex items-center text-(--text-muted) pointer-events-none">
          {loading ? (
            <Spinner size="sm" variant="muted" />
          ) : (
            <Search size={15} />
          )}
        </span>

        <input
          ref={ref}
          type="search"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full h-9 pl-9 pr-8 text-sm rounded-md',
            'bg-(--bg-elevated) text-(--text-primary)',
            'border border-(--border-default)',
            'placeholder:text-(--text-muted)',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-(--brand-500)/40',
            'focus:border-(--brand-500)',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            '[&::-webkit-search-cancel-button]:hidden',
          )}
        />

        {hasValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              'absolute right-2.5 flex items-center justify-center',
              'w-4 h-4 rounded-full',
              'text-(--text-muted) hover:text-(--text-primary)',
              'hover:bg-(--bg-subtle) transition-colors duration-150',
            )}
          >
            <X size={11} />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
