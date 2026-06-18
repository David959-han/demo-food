'use client';
import { FC, useState } from 'react';
import menuData from '../../../data/customer/menu.json';
import { useLanguage } from '../../../context/LanguageContext';

const POS: FC = () => {
  const { t } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const addItem = (item: any) => setSelectedItems([...selectedItems, item]);
  const total = selectedItems.reduce((sum, item) => sum + parseInt(item.price.replace('$','')), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t['pos']}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {menuData.map(item => (
          <div key={item.id} className="bg-slate-900 p-2 rounded shadow hover:scale-105 transition-transform">
            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded mb-2"/>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-slate-400">{item.price}</p>
            <button
              onClick={() => addItem(item)}
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-1 rounded"
            >
              {t['add']}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-4 rounded shadow">
        <h3 className="font-bold">{t['selected_items']}</h3>
        <ul>
          {selectedItems.map((item, idx) => (
            <li key={idx}>{item.name} - {item.price}</li>
          ))}
        </ul>
        <p className="mt-2 font-semibold">{t['total']}: ${total}</p>
        <button className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">{t['checkout']}</button>
      </div>
    </div>
  );
};

export default POS;
