'use client';
import { FC, useEffect, useState } from 'react';
import inventoryData from '../../../data/management/inventory.json';
import { useLanguage } from '../../../context/LanguageContext';

const Inventory: FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(inventoryData);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t['inventory']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold">{item.name}</h3>
            <p>{t['quantity']}: {item.quantity}</p>
            <p>{t['price']}: {item.price}</p>
            <p>{t['status']}: {t[item.status.toLowerCase().replace(/ /g,'_')]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
