import {
  Badge,
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useBrandStore } from '../context/WordsStoreFactory';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';
import { ChevronDown, Trash2 } from 'lucide-react';

export const BrandsSelectorComponent = () => {
  const Brands = useBrandStore((st) => st.words);
  const isLoading = useBrandStore((st) => st.isLoading);
  const removeBrand = useBrandStore((st) => st.deleteWord);

  return (
    <div className='flex items-center'>
      <GenerateWordsWithAiButton
        isLoading={isLoading}
        type='Brands'
        isBrandButton
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='secondary'
            size='icon'
            className='rounded-s-none'
            type='button'
          >
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {Brands.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Brands</EmptyTitle>
                <EmptyDescription className='text-xs'>
                  Add POsitive Keywords then Generate Brands with AI clicking
                  the button bellow
                </EmptyDescription>
                <EmptyContent>
                  <GenerateWordsWithAiButton
                    isLoading={isLoading}
                    type='Brands'
                  />
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          )}
          {Brands.map((brand, index) => (
            <Badge
              key={index + brand}
              variant='secondary'
              className='text-xs! mx-2 my-1'
            >
              {brand}{' '}
              <span
                className='text-xs ml-2 bg-destructive/10 text-destructive px-1 rounded cursor-pointer'
                onClick={() => removeBrand(brand)}
              >
                <Trash2 className='size-3' />
              </span>
            </Badge>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
