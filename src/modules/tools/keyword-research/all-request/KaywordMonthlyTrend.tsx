import { MonthlySearchEntity } from '@/core/entities';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: MonthlySearchEntity[];
}

const Month: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export function KeywordMonthlyTrend({ data }: Props) {
  const chartData = data.toReversed();

  return (
    <div style={{ width: 80, height: 40 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData}>
          <Tooltip
            cursor={false}
            contentStyle={{
              fontSize: '12px',
              padding: '4px 8px',
              background: '#1a1a1a100',
              border: 'none',
            }}
            labelFormatter={(_, payload) => {
              const d = payload?.[0]?.payload;
              return d ? `${Month[d.month]}/${d.year}` : '';
            }}
          />

          <Area
            type='monotone'
            dataKey='search_volume'
            stroke='#2563eb'
            fill='#2563eb'
            fillOpacity={0.25}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KeywordMonthlyTrend2({ data }: Props) {
  const chartData = data.toReversed();

  return (
    <div style={{ width: '100%', height: 120 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData}>
          <Tooltip
            cursor={false}
            contentStyle={{
              fontSize: '12px',
              padding: '4px 8px',
              background: '#1a1a1a100',
              border: 'none',
            }}
            labelFormatter={(_, payload) => {
              const d = payload?.[0]?.payload;
              return d ? `${Month[d.month]}/${d.year}` : '';
            }}
          />

          <XAxis
            dataKey='month'
            tickFormatter={(month) => Month[month]}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10 }} axisLine={true} tickLine={false} />

          <Area
            type='monotone'
            dataKey='search_volume'
            stroke='#2563eb'
            fill='#2563eb'
            fillOpacity={0.25}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
