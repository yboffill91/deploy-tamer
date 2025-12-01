'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordResultEntity } from '@/core/entities';

interface TrendChartProps {
  keywords: KeywordResultEntity[];
}

const monthNames = [
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
];

export function TrendChart({ keywords }: TrendChartProps) {
  const topKeywords = keywords.slice(0, 3);

  const chartData =
    topKeywords[0]?.monthly_searches
      .slice()
      .reverse()
      .map((month, idx) => {
        const data: unknown = {
          month: monthNames[idx % 12],
          date: `${month.year}-${String(month.month).padStart(2, '0')}`,
        };

        topKeywords.forEach((keyword, kidx) => {
          const monthData = keyword.monthly_searches.find(
            (m) => m.year === month.year && m.month === month.month
          );
          data[`keyword_${kidx}`] = monthData?.search_volume || 0;
        });

        return data;
      }) || [];

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Search Volume Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='hsl(var(--color-border))'
            />
            <XAxis
              dataKey='month'
              stroke='hsl(var(--color-muted-foreground))'
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke='hsl(var(--color-muted-foreground))'
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--color-card))',
                border: '1px solid hsl(var(--color-border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--color-foreground))' }}
            />
            <Legend />
            {topKeywords.map((keyword, idx) => (
              <Line
                key={idx}
                type='monotone'
                dataKey={`keyword_${idx}`}
                stroke={colors[idx]}
                name={
                  keyword.keyword.slice(0, 15) +
                  (keyword.keyword.length > 15 ? '...' : '')
                }
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
