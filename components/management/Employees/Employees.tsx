'use client';
import { FC, useEffect, useState } from 'react';
import employeesData from '../../../data/management/employees.json';
import { useLanguage } from '../../../context/LanguageContext';

const Employees: FC = () => {
  const { t } = useLanguage();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    setEmployees(employeesData);
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-bold">{t['employees']}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {employees.map(emp => (
          <div key={emp.id} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold">{emp.name}</h3>
            <p>{t['position']}: {emp.position}</p>
            <p>{t['shift']}: {emp.shift}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
