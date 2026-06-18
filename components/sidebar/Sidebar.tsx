'use client';
import { FC, useState } from 'react';
import { LucideHome, LucideUsers, LucideClipboard, LucideBarChart2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  const menuItems = [
    { label: t['dashboard'], icon: <LucideHome size={18} /> },
    { label: t['operations'], icon: <LucideClipboard size={18} /> },
    { label: t['management'], icon: <LucideUsers size={18} /> },
    { label: t['analytics'], icon: <LucideBarChart2 size={18} /> }
  ];

  return (
    <aside className={`bg-zinc-900 text-white p-4 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <button onClick={() => setCollapsed(!collapsed)} className="mb-4 p-2 bg-slate-800 rounded">
        {collapsed ? '>>' : '<<'}
      </button>
      <ul className="space-y-2">
        {menuItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            {item.icon} {!collapsed && item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
