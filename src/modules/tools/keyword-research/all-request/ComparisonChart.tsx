'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordResultEntity } from '@/core/entities';

interface ComparisonChartProps {
  keywords: KeywordResultEntity[];
}

export function ComparisonChart({ keywords }: ComparisonChartProps) {
  const chartData = keywords.map((k) => ({
    name: k.keyword,
    x: k.cpc,
    y: k.search_volume / 1000000, // Convert to millions
    competition: k.competition,
  }));

  const getColor = (competition: string) => {
    switch (competition) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>CPC vs Search Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='hsl(var(--color-border))'
            />
            <XAxis
              type='number'
              dataKey='x'
              name='CPC ($)'
              stroke='hsl(var(--color-muted-foreground))'
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type='number'
              dataKey='y'
              name='Volume (M)'
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
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter name='Keywords' data={chartData}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.competition)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
