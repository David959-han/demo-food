'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { AccessDenied } from '@/components/ui/AccessDenied';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { NAV_ITEMS, hasPermission, isRouteActive } from '@/lib/navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const menuTriggerRef              = useRef<HTMLButtonElement>(null);

  const theme       = useRestaurantStore((s) => s.theme);
  const currentUser = useRestaurantStore((s) => s.currentUser);
  const pathname    = usePathname();
  const router      = useRouter();

  useEffect(() => {
    Promise.resolve(true).then(setMounted);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Redirect to login if no user after mount
  useEffect(() => {
    if (!mounted) return;
    if (!currentUser && pathname !== '/login') {
      router.replace('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, currentUser]);

  // Determine if current route requires a permission the user lacks
  const pageItem    = NAV_ITEMS.find((item) => isRouteActive(pathname, item.href));
  const accessDenied = mounted
    && !!currentUser
    && !!pageItem
    && !hasPermission(currentUser.role, pageItem.permission);

  const pageContent = accessDenied ? <AccessDenied /> : children;

  return (
    <div className="flex h-screen bg-(--bg-base) text-(--text-primary)">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        triggerRef={menuTriggerRef}
      />

      {/* Main content column */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onMenuClick={() => setDrawerOpen(true)}
          menuTriggerRef={menuTriggerRef}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 overflow-auto p-5 lg:p-6"
          >
            {pageContent}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
