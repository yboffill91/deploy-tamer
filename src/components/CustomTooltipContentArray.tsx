'use client';

import { useRegionStore } from '@/modules/tools/keyword-research/context/RegionStore';

export const CustomTooltipContent = () => {
  const finalValue = useRegionStore((st) => st.finalValue);
  return (
    <div className='flex items-center justify-start flex-wrap gap-2'>
      {finalValue.size === 0 ? (
        'No Region Selected'
      ) : (
        <p>
          {finalValue.size === 1 ? '1 Region' : finalValue.size + ' Regions '}
          Selected{' '}
        </p>
      )}
    </div>
  );
};
