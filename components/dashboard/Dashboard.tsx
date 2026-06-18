'use client';
import { FC, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../../data/dashboardData.json';
import { useLanguage } from '../../context/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: FC = () => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    setDashboardData(data);
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: t['revenue'],
        data: [1200, 1900, 1500, 2200, 1700, 2100, 2500],
        borderColor: '#f97316',
        backgroundColor: '#fb923c'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardData.kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="bg-slate-900 p-4 rounded shadow hover:scale-105 transition-transform">
            <h2 className="text-lg font-semibold">{kpi.title}</h2>
            <p className="text-slate-400">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-slate-900 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">{t['profit_analysis']}</h2>
        <Line data={lineData} />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded shadow overflow-auto">
          <h2 className="text-xl font-bold mb-2">Recent Orders</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-slate-800 pb-2">ID</th>
                <th className="border-b border-slate-800 pb-2">Table</th>
                <th className="border-b border-slate-800 pb-2">Customer</th>
                <th className="border-b border-slate-800 pb-2">Total</th>
                <th className="border-b border-slate-800 pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-800">
                  <td>{order.id}</td>
                  <td>{order.table}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popular Menu Items */}
        <div className="grid grid-cols-2 gap-4">
          {dashboardData.popularMenu.map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-900 p-2 rounded shadow hover:scale-105 transition-transform">
              <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-slate-400">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
