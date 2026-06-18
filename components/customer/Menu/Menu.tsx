'use client';
import { FC, useEffect, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import menuData from '../../../data/customer/menu.json';

const Menu: FC = () => {
  const { t } = useLanguage();
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    setMenu(menuData);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t['menu']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {menu.map(item => (
          <div key={item.id} className="bg-slate-900 rounded shadow hover:scale-105 transition-transform">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-t" />
            <div className="p-2">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-slate-400">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
