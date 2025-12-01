import type { KeywordResultEntity } from '@/core/entities';
import { KpiCard } from './KpiCard';

export function KeywordOverview({
  result,
}: {
  result?: KeywordResultEntity[];
}) {
  if (!result || !result.length) return null;

  const main = result[0];

  return (
    <div className='grid grid-cols-3 gap-2'>
      <KpiCard label='Search Volume' value={main.search_volume ?? 'N/A'} />
      <KpiCard label='CPC' value={`$${main.cpc ?? 0}`} />
      <KpiCard label='Competition' value={main.competition ?? 'N/A'} />
    </div>
  );
}
