'use client';

import { useRegionStore } from '@/modules/tools/keyword-research/context/NewRegionStore';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from './ui';
import { Globe2 } from 'lucide-react';

export const CustomTooltipContent = () => {
  const finalValue = useRegionStore((st) => st.finalValue);
  return (
    <div className='flex items-center justify-start flex-wrap gap-2'>
      {finalValue.size === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Globe2 />
            </EmptyMedia>
            <EmptyTitle>No Regions Selected</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <p>
          {finalValue.size === 1 ? '1 Region' : finalValue.size + ' Regions '}
          Selected{' '}
        </p>
      )}
    </div>
  );
};
