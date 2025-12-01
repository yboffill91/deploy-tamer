'use client';

import type React from 'react';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { KeywordResearchEntity, KeywordResultEntity } from '@/core/entities';
import CompetitionBadge from './CompetitionBadge';
import { GenericDataTable } from '@/components/GenericDataTable';
import SearchVolumeTrend from './SearchVolumeTrend';

export default function KeywordDataTable({
  keywordData,
}: {
  keywordData: KeywordResearchEntity;
}) {
  const [selectedKeywords, setSelectedKeywords] = useState<
    KeywordResultEntity[]
  >([]);

  const handleFinalize = () => {
    const result = {
      keyword: selectedKeywords,
    };
    console.log('[v0] Selected Keywords:', result);
    alert(JSON.stringify(result, null, 2));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const customRenderers: Record<
    string,
    (value: unknown, item: KeywordResultEntity) => ReactNode
  > = {
    keyword: (value) => (
      <span className='font-semibold text-foreground'>{value}</span>
    ),
    cpc: (value) => (
      <span className='text-foreground'>${(value as number).toFixed(2)}</span>
    ),
    competition: (value) => (
      <CompetitionBadge competition={value as 'LOW' | 'MEDIUM' | 'HIGH'} />
    ),
    search_volume: (value) => (
      <span className='text-foreground font-medium'>
        {formatNumber(value as number)}
      </span>
    ),
    monthly_searches: (value) => <SearchVolumeTrend data={value} />,
  };

  return (
    <div className='space-y-4'>
      <GenericDataTable<KeywordResultEntity>
        data={keywordData.result as KeywordResultEntity[]}
        // enableMultiSelect={true}
        // onSelectionChange={setSelectedKeywords}
        excludeColumns={[
          'language_code',
          'location_code',
          'search_partners',
          'competition_index',
          'keyword_annotations',
          'low_top_of_page_bid',
          'high_top_of_page_bid',
        ]}
        customRenderers={customRenderers}
        showAddButton={false}
      />

      <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
        <div className='text-sm text-muted-foreground'>
          {selectedKeywords.length > 0 ? (
            <>
              <span className='font-semibold text-foreground'>
                {selectedKeywords.length}
              </span>{' '}
              keyword
              {selectedKeywords.length !== 1 ? 's' : ''} selected
            </>
          ) : (
            'No keywords selected'
          )}
        </div>
        <Button
          onClick={handleFinalize}
          disabled={selectedKeywords.length === 0}
          className='bg-primary text-primary-foreground hover:bg-primary/90'
        >
          Finalizar ({selectedKeywords.length})
        </Button>
      </div>
    </div>
  );
}
