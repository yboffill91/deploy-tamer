import { KeywordResultEntity } from '@/core/entities';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KeywordMonthlyTrend, KeywordMonthlyTrend2 } from '../KaywordMonthlyTrend';
import { KeywordMetadata } from './KaywordMetadata';
import { KeywordBids } from './KeywordBids';
import { KeywordConcepts } from './KeywordConcepts';

interface Props {
  keyword: KeywordResultEntity;
}

export function KeywordInfo({ keyword }: Props) {
  return (
    <div className='space-y-4'>
      <div>
        <h2 className=' font-semibold leading-tight text-3xl'>
          {keyword.keyword ?? '—'}
        </h2>

        <div className='flex flex-wrap gap-2 mt-2'>
          <Badge variant='info'>
            CPC (USD): ${keyword.cpc?.toFixed(2) ?? '—'}
          </Badge>

          <Badge variant={competitionVariant(keyword.competition)}>
           Competition: {keyword.competition ?? '—'}
          </Badge>

          <Badge >
            Search Volume: {keyword.search_volume?.toLocaleString() ?? '—'}
          </Badge>
        </div>
      </div>

      <Separator />

      {keyword.monthly_searches?.length ? (
        <div>
          <p className='text-sm text-muted-foreground mb-2'>
            Monthly trend (12 months)
          </p>
          <KeywordMonthlyTrend2 data={keyword.monthly_searches} />
        </div>
      ) : null}

      <Separator />

      <KeywordMetadata keyword={keyword} />

      <Separator />

      <KeywordBids keyword={keyword} />

      
    </div>
  );
}



function competitionVariant(level?: 'LOW' | 'MEDIUM' | 'HIGH') {
  if (level === 'HIGH') return 'destructive';
  if (level === 'MEDIUM') return 'warning';
  return 'success';
}