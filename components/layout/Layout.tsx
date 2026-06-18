'use client';

import { FC, ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from '../sidebar/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar
            toggleDarkMode={toggleDarkMode}
            isDark={isDark}
          />

          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
