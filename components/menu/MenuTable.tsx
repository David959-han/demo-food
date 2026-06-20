'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Eye, Pencil, Copy, Archive, Star, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import type { MenuItemWithStats, MenuCategory, MenuItemStatus } from '@/types/menu';
import type { BadgeVariant } from '@/components/ui/Badge';
import type { TranslationKey } from '@/types/i18n';

const STATUS_VARIANT: Record<MenuItemStatus, BadgeVariant> = {
  active:   'success',
  inactive: 'neutral',
  sold_out: 'warning',
};

const SKELETON_ROWS = 6;

interface MenuTableProps {
  items:      MenuItemWithStats[];
  categories: MenuCategory[];
  loading:    boolean;
}

export function MenuTable({ items, categories, loading }: MenuTableProps) {
  const { t } = useTranslation();

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? t(`menu_cat.${cat.key}` as TranslationKey) : '—';
  };

  return (
    <div className="rounded-xl bg-(--bg-surface) border border-(--border-default) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-(--border-subtle)">
              {/* Name */}
              <th className="text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('common.item')}
              </th>
              {/* Category */}
              <th className="hidden sm:table-cell text-left px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('common.category')}
              </th>
              {/* Price */}
              <th className="text-right px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('common.price')}
              </th>
              {/* Cost */}
              <th className="hidden md:table-cell text-right px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('menu.cost')}
              </th>
              {/* Margin */}
              <th className="hidden md:table-cell text-right px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('menu.margin')}
              </th>
              {/* Sold */}
              <th className="hidden lg:table-cell text-right px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                {t('menu.sold')}
              </th>
              {/* Status */}
              <th className="text-center px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide w-28" scope="col">
                {t('common.status')}
              </th>
              {/* Actions */}
              <th className="text-right px-4 py-3 text-xs font-semibold text-(--text-disabled) uppercase tracking-wide" scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton shape="circle" width="2rem" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton shape="line" width="8rem" />
                          <Skeleton shape="line" width="12rem" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3"><Skeleton shape="line" width="5rem" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton shape="line" width="3rem" /></td>
                    <td className="hidden md:table-cell px-4 py-3 text-right"><Skeleton shape="line" width="3rem" /></td>
                    <td className="hidden md:table-cell px-4 py-3 text-right"><Skeleton shape="line" width="3rem" /></td>
                    <td className="hidden lg:table-cell px-4 py-3 text-right"><Skeleton shape="line" width="3rem" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton shape="line" width="5rem" /></td>
                    <td className="px-4 py-3"><Skeleton shape="line" width="5.5rem" /></td>
                  </tr>
                ))
              : items.length === 0
                ? (
                  <tr>
                    <td colSpan={8} className="py-4">
                      <EmptyState
                        title={t('menu.no_items')}
                        description={t('menu.no_items_desc')}
                        illustration="menu"
                        size="sm"
                      />
                    </td>
                  </tr>
                )
                : items.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-(--bg-subtle) transition-colors duration-100"
                  >
                    {/* Name + description */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <MenuThumb src={item.image} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-(--text-primary) truncate flex items-center gap-1.5">
                            {item.name}
                            {item.isPopular && (
                              <Star size={11} className="text-(--brand-400) shrink-0" fill="currentColor" />
                            )}
                          </p>
                          <p className="text-xs text-(--text-muted) truncate max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden sm:table-cell px-4 py-3 text-sm text-(--text-secondary)">
                      {getCategoryName(item.categoryId)}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-sm text-(--text-primary) tabular-nums text-right font-medium">
                      ${item.price.toFixed(2)}
                    </td>

                    {/* Cost */}
                    <td className="hidden md:table-cell px-4 py-3 text-sm text-(--text-secondary) tabular-nums text-right">
                      ${item.costPrice.toFixed(2)}
                    </td>

                    {/* Margin */}
                    <td className="hidden md:table-cell px-4 py-3 text-right">
                      <span className={cn(
                        'text-sm tabular-nums font-medium',
                        item.profitMargin >= 60 ? 'text-(--success-400)' : 'text-(--text-secondary)',
                      )}>
                        {item.profitMargin.toFixed(1)}%
                      </span>
                    </td>

                    {/* Total sold */}
                    <td className="hidden lg:table-cell px-4 py-3 text-sm text-(--text-secondary) tabular-nums text-right">
                      {item.totalSold.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANT[item.status]} shape="pill">
                        {t(`status.${item.status}` as TranslationKey)}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <IconButton
                          icon={<Eye size={14} />}
                          size="xs"
                          variant="ghost"
                          aria-label={t('menu.action_view')}
                          title={t('menu.action_view')}
                        />
                        <IconButton
                          icon={<Pencil size={14} />}
                          size="xs"
                          variant="ghost"
                          aria-label={t('menu.action_edit')}
                          title={t('menu.action_edit')}
                        />
                        <IconButton
                          icon={<Copy size={14} />}
                          size="xs"
                          variant="ghost"
                          aria-label={t('menu.action_duplicate')}
                          title={t('menu.action_duplicate')}
                        />
                        <IconButton
                          icon={<Archive size={14} />}
                          size="xs"
                          variant="ghost"
                          aria-label={t('menu.action_archive')}
                          title={t('menu.action_archive')}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MenuThumb({ src }: { src: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-(--bg-elevated) overflow-hidden">
      {src && !err ? (
        <Image
          src={src}
          alt=""
          width={32}
          height={32}
          onError={() => setErr(true)}
          className="w-8 h-8 rounded-lg object-cover"
        />
      ) : (
        <UtensilsCrossed size={14} className="text-(--text-disabled)" />
      )}
    </div>
  );
}
