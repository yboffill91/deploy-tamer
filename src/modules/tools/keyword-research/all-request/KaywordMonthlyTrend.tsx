import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlySearchEntity } from '@/core/entities';

export function KeywordMonthlyTrend({
  data,
}: {
  data?: MonthlySearchEntity[];
}) {
  if (!data?.length) return null;

  return (
    <ResponsiveContainer width='100%' height={280}>
      <BarChart data={data}>
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='search_volume' />
      </BarChart>
    </ResponsiveContainer>
  );
}
