'use client';
import { Badge, Button, Empty, EmptyMedia, EmptyTitle } from '@/components/ui';
import { BrandsEntity } from '@/core/entities';
import { Check, Tags } from 'lucide-react';
import { useState } from 'react';

interface Props {
  brands: BrandsEntity[];
  preSelectedBrands: BrandsEntity[] | null;
  onFinishSelection(brands: BrandsEntity[]): void;
}

export const CustomBrandsSelector = ({
  brands,
  preSelectedBrands,
  onFinishSelection,
}: Props) => {
  const [selectedBrands, setSelectedBrands] = useState<BrandsEntity[]>(
    preSelectedBrands ?? []
  );

  const toggleBrand = (brand: BrandsEntity) => {
    const exists = selectedBrands.some((b) => b.id === brand.id);

    if (exists) {
      setSelectedBrands(selectedBrands.filter((b) => b.id !== brand.id));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return brands.length > 0 ? (
    <div className=' flex flex-col items-center justify-center gap-4'>
      <ul className='flex items-center justify-center gap-2'>
        {brands.map((brand) => {
          const isSelected = selectedBrands.some((b) => b.id === brand.id);

          return (
            <li key={brand.id}>
              <Badge
                variant={isSelected ? 'default' : 'outline'}
                className='text-base cursor-pointer'
                onClick={() => {
                  toggleBrand(brand);
                }}
              >
                {brand.name}
              </Badge>
            </li>
          );
        })}
      </ul>

      <Button
        type='button'
        variant={'outline'}
        onClick={() => {
          onFinishSelection(selectedBrands);
        }}
      >
        <Check />
        {selectedBrands.length === 0
          ? 'Close Selection'
          : `${selectedBrands.length} Selected`}
      </Button>
    </div>
  ) : (
    <Empty>
      <EmptyMedia variant='icon'>
        <Tags />
      </EmptyMedia>
      <EmptyTitle>No Brands Available</EmptyTitle>
    </Empty>
  );
};
