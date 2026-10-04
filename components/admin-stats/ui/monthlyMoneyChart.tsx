'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { IAdminStatsMonthlyPoint } from '@/domain/stats';
import { formatMoney } from '../helpers/formatMoney';

interface IMonthlyMoneyChartProps {
  points: IAdminStatsMonthlyPoint[];
}

const hasChartData = (points: IAdminStatsMonthlyPoint[]): boolean =>
  points.some((point) => point.received !== 0 || point.mastered !== 0);

const formatAxisMoney = (value: number): string =>
  new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const MonthlyMoneyChart = ({ points }: IMonthlyMoneyChartProps) => (
  <div className="bg-white shadow rounded-lg p-4 sm:p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Деньги по месяцам</h2>
    {!hasChartData(points) && <p className="text-gray-500 text-sm">Нет данных</p>}
    {hasChartData(points) && (
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tickFormatter={formatAxisMoney} tick={{ fontSize: 11 }} width={56} />
            <Tooltip
              formatter={(value) => formatMoney(typeof value === 'number' ? value : Number(value ?? 0))}
              labelFormatter={(label) => String(label)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="received" name="Поступило" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mastered" name="Освоено" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);
