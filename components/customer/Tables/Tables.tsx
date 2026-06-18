'use client';
import { FC, useEffect, useState } from 'react';
import tablesData from '../../../data/customer/tables.json';
import { useLanguage } from '../../../context/LanguageContext';

const Tables: FC = () => {
  const { t } = useLanguage();
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    setTables(tablesData);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t['tables']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {tables.map(table => (
          <div
            key={table.id}
            className={`p-4 rounded shadow text-center cursor-pointer hover:scale-105 transition-transform ${
              table.status === 'Free' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <h3 className="font-semibold">{t['table']} {table.id}</h3>
            <p>{t[table.status.toLowerCase()]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
