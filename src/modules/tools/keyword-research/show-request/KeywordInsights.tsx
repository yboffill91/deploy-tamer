import { Card } from '@/components/ui/card';
import type { MonthlySearchEntity } from '@/core/entities';
import { Brain, TrendingDown, TrendingUp } from 'lucide-react';

export function KeywordInsights({ data }: { data?: MonthlySearchEntity[] }) {
  if (!data?.length) return null;

  const max = data.reduce((a, b) =>
    a.search_volume > b.search_volume ? a : b
  );
  const min = data.reduce((a, b) =>
    a.search_volume < b.search_volume ? a : b
  );

  return (
    <Card className='p-4 space-y-2'>
      <p>
        <TrendingUp /> Peak month: <strong>{max.month}</strong> with{' '}
        {max.search_volume.toLocaleString()} searches.
      </p>
      <p>
        <TrendingDown /> Lowest month: <strong>{min.month}</strong> with{' '}
        {min.search_volume.toLocaleString()} searches.
      </p>
      <p>
        <Brain /> Suggestion: Publish/update content 1–2 months before the peak
        season.
      </p>
    </Card>
  );
}
