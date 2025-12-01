import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordResultEntity } from '@/core/entities';
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react';

interface StatsOverviewProps {
  keywords: KeywordResultEntity[];
}

export function StatsOverview({ keywords }: StatsOverviewProps) {
  const totalVolume = keywords.reduce((sum, k) => sum + k.search_volume, 0);
  const avgCpc = (
    keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length
  ).toFixed(2);
  const highCompetition = keywords.filter(
    (k) => k.competition === 'HIGH'
  ).length;
  const maxVolume = Math.max(...keywords.map((k) => k.search_volume));

  const stats = [
    {
      label: 'Total Search Volume',
      value: (totalVolume / 1000000).toFixed(1),
      unit: 'M',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      label: 'Average CPC',
      value: avgCpc,
      unit: '$',
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      label: 'High Competition',
      value: highCompetition,
      unit: 'keywords',
      icon: Target,
      color: 'text-red-400',
    },
    {
      label: 'Peak Volume',
      value: (maxVolume / 1000000).toFixed(1),
      unit: 'M',
      icon: BarChart3,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12'>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className='relative overflow-hidden'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.label}
                </CardTitle>
                <Icon className={`${stat.color}`} size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-baseline gap-1'>
                <span className='text-3xl font-bold'>{stat.value}</span>
                <span className='text-sm text-muted-foreground'>
                  {stat.unit}
                </span>
              </div>
            </CardContent>
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/50 to-primary/0' />
          </Card>
        );
      })}
    </div>
  );
}
