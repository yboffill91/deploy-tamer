import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function Sparkline({
  data,
}: {
  data: { month: number; search_volume: number }[];
}) {
  return (
    <ResponsiveContainer width='100%' height={60}>
      <LineChart data={data}>
        <Line
          type='monotone'
          dataKey='search_volume'
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
