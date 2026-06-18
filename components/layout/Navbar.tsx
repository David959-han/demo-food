'use client';
import { FC } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDark: boolean;
}

const Navbar: FC<NavbarProps> = ({ toggleDarkMode, isDark }) => {
  const { lang, setLanguage, t } = useLanguage();
  return (
    <nav className="flex justify-between items-center p-4 bg-slate-950 dark:bg-slate-900 text-white">
      <div className="font-bold text-xl">FoodERP</div>
      <div className="flex items-center gap-4">
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ru' | 'uz')}
          className="bg-zinc-900 text-white p-1 rounded"
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
        </select>
        <button
          onClick={toggleDarkMode}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
        >
          {isDark ? t['light_mode'] : t['dark_mode']}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
