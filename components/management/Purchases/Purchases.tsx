'use client';
import { FC, useEffect, useState } from 'react';
import purchasesData from '../../../data/management/purchases.json';
import { useLanguage } from '../../../context/LanguageContext';

const Purchases: FC = () => {
  const { t } = useLanguage();
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    setPurchases(purchasesData);
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">{t['purchases']}</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b border-slate-800 pb-2">{t['id']}</th>
            <th className="border-b border-slate-800 pb-2">{t['supplier']}</th>
            <th className="border-b border-slate-800 pb-2">{t['item']}</th>
            <th className="border-b border-slate-800 pb-2">{t['quantity']}</th>
            <th className="border-b border-slate-800 pb-2">{t['total']}</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p.id} className="hover:bg-slate-800">
              <td>{p.id}</td>
              <td>{p.supplier}</td>
              <td>{p.item}</td>
              <td>{p.quantity}</td>
              <td>{p.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Purchases;
