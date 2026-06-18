'use client';
import { FC, useEffect, useState } from 'react';
import kitchenData from '../../../data/operations/kitchen.json';
import { useLanguage } from '../../../context/LanguageContext';

const KitchenDisplay: FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setOrders(kitchenData);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t['kitchen_display']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold">{t['order']} #{order.id}</h3>
            <ul className="mt-2">
              {order.items.map((item:any, idx:number) => (
                <li key={idx}>{item.name} x{item.qty}</li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">{t['status']}: {t[order.status.toLowerCase()]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplay;
