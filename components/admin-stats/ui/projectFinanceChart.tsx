'use client';

import { useRouter } from 'next/navigation';
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
import type { IAdminStatsProjectFinanceBar } from '@/domain/stats';
import { formatMoney } from '../helpers/formatMoney';

interface IProjectFinanceChartProps {
  bars: IAdminStatsProjectFinanceBar[];
}

const formatAxisMoney = (value: number): string =>
  new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const chartHeight = (count: number): number => Math.min(Math.max(280, count * 40), 720);

export const ProjectFinanceChart = ({ bars }: IProjectFinanceChartProps) => {
  const router = useRouter();

  const handleBarClick = (payload: unknown) => {
    const row = payload as IAdminStatsProjectFinanceBar;
    if (!row?.clientId) return;
    router.push(`/admin/clients/${row.clientId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Остаток и к доплате по проектам</h2>
      <p className="text-xs text-gray-500 mb-4">Нажмите на полосу, чтобы открыть карточку заказчика</p>
      {bars.length === 0 && <p className="text-gray-500 text-sm">Нет данных</p>}
      {bars.length > 0 && (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[280px]" style={{ height: chartHeight(bars.length) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bars}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={formatAxisMoney} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  tick={{ fontSize: 10 }}
                  className="sm:[&_text]:text-xs"
                />
                <Tooltip
                  formatter={(value) => formatMoney(typeof value === 'number' ? value : Number(value ?? 0))}
                  labelFormatter={(label) => String(label)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="balanceOnHand"
                  name="Остаток на руках"
                  fill="#2563eb"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(data) => handleBarClick(data.payload)}
                />
                <Bar
                  dataKey="dueNow"
                  name="К доплате сейчас"
                  fill="#dc2626"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(data) => handleBarClick(data.payload)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
