import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KeywordData {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: string;
  monthly_searches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
}

interface KeywordCardProps {
  keyword: KeywordData;
}

export function KeywordCard({ keyword }: KeywordCardProps) {
  const currentVolume = keyword.monthly_searches[0]?.search_volume || 0;
  const previousVolume =
    keyword.monthly_searches[1]?.search_volume || currentVolume;
  const trend = currentVolume >= previousVolume ? 'up' : 'down';
  const trendPercent = previousVolume
    ? Math.round(((currentVolume - previousVolume) / previousVolume) * 100)
    : 0;

  const competitionColor =
    {
      LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
    }[keyword.competition] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <Card className='hover:border-primary/50 transition-colors'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-lg truncate'>
              {keyword.keyword}
            </CardTitle>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${competitionColor}`}
          >
            {keyword.competition}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Search Volume */}
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Search Volume</p>
            <div className='flex items-baseline gap-2'>
              <p className='text-2xl font-bold'>
                {(currentVolume / 1000000).toFixed(1)}M
              </p>
              <div
                className={`flex items-center gap-1 text-sm ${
                  trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(trendPercent)}%</span>
              </div>
            </div>
          </div>

          {/* CPC */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>CPC</p>
              <p className='text-xl font-bold text-chart-1'>
                ${keyword.cpc.toFixed(2)}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Bid Range</p>
              <p className='text-xs text-muted-foreground'>
                Low to High bidding available
              </p>
            </div>
          </div>

          {/* Type Badge */}
          <div className='pt-2 border-t border-border'>
            <span className='inline-block px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-md'>
              Informational
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
