'use client';
import { FC, useEffect, useState } from 'react';
import deliveryData from '../../../data/operations/deliveries.json';
import { useLanguage } from '../../../context/LanguageContext';

const DeliveryBoard: FC = () => {
  const { t } = useLanguage();
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    setDeliveries(deliveryData);
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">{t['delivery_board']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {deliveries.map(delivery => (
          <div key={delivery.id} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold">{t['delivery']} #{delivery.id}</h3>
            <p>{t['customer']}: {delivery.customer}</p>
            <p>{t['address']}: {delivery.address}</p>
            <p>{t['rider']}: {delivery.rider}</p>
            <p>{t['status']}: {t[delivery.status.toLowerCase().replace(/ /g,'_')]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoard;
