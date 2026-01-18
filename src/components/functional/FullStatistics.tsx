import { useEffect, useState } from 'react';
import type { StatsData } from '../../lib/types';
import { receiptService } from '../../lib/api';
import { Loader } from '../ui/Loader';
import { Wallet, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const FullStatistics: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await receiptService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center">
        <Loader size={256} color="blue" />
      </div>
    );
  }

  if (!stats)
    return <div className="text-center py-10">Failed to load data</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Receipts</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.receiptsCount}
            </p>
          </div>
        </div>
        {stats.currencyList.map((curr, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total in {curr.code}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {curr.amount.toLocaleString()}{' '}
                <span className="text-sm text-slate-400">{curr.code}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={18} /> Monthly Activity
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Top Vendors
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topVendors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  label
                  dataKey="amount"
                >
                  {stats.topVendors.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
