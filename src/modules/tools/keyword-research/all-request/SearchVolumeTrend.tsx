'use client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MonthlySearch {
  year: number;
  month: number;
  search_volume: number;
}

interface SearchVolumeTrendProps {
  data: MonthlySearch[];
}

export default function SearchVolumeTrend({ data }: SearchVolumeTrendProps) {
  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const maxVolume = Math.max(...sortedData.map((d) => d.search_volume));
  const chartData = sortedData.map((item) => ({
    value: (item.search_volume / maxVolume) * 100,
    original: item.search_volume,
  }));

  return (
    <div className='w-32 h-12 flex items-center justify-center'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
        >
          <Line
            type='monotone'
            dataKey='value'
            stroke='currentColor'
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            className='text-primary'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
