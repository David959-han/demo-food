'use client';
import { FC, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import reportsData from '../../data/analytics/reports.json';
import { useLanguage } from '../context/LanguageContext';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics: FC = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    setReports(reportsData);
  }, []);

  const lineData = {
    labels: reports.map(r => r.date),
    datasets: [
      {
        label: t['revenue'],
        data: reports.map(r => r.revenue),
        borderColor: '#f97316',
        backgroundColor: '#fb923c'
      },
      {
        label: t['profit'],
        data: reports.map(r => r.profit),
        borderColor: '#10b981',
        backgroundColor: '#34d399'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t['analytics']}</h2>

      <div className="bg-slate-900 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">{t['reports']}</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-800 pb-2">{t['date']}</th>
              <th className="border-b border-slate-800 pb-2">{t['orders']}</th>
              <th className="border-b border-slate-800 pb-2">{t['revenue']}</th>
              <th className="border-b border-slate-800 pb-2">{t['profit']}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-slate-800">
                <td>{r.date}</td>
                <td>{r.orders}</td>
                <td>${r.revenue}</td>
                <td>${r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">{t['profit_analysis']}</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Analytics;
