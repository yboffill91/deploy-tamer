'use client';

import { useRegionStore } from '@/modules/tools/keyword-research/context/RegionStore';
import { useBrandStore } from '@/modules/tools/keyword-research/context/WordsStoreFactory';

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

export const BrandsTooltipContent = () => {
  const Brands = useBrandStore((st) => st.words);
  return (
    <div className='flex items-center justify-start flex-wrap gap-2'>
      {Brands.length === 0 ? (
        'No Brands Selected'
      ) : (
        <p>
          {Brands.length === 1 ? '1 Brand' : Brands.length + ' Brands '}
          Selected{' '}
        </p>
      )}
    </div>
  );
};
