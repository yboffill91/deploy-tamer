import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useBrandStore } from '../context/WordsStoreFactory';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';
import { ChevronDown } from 'lucide-react';
import { KeywordResearchWordsComponent } from './KeywordResearchWordsComponent';

export const BrandsSelectorComponent = () => {
  const Brands = useBrandStore((st) => st.words);
  const isLoading = useBrandStore((st) => st.isLoading);
  const addBrand = useBrandStore((st) => st.addWord);
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
          <KeywordResearchWordsComponent
            addHandler={(word) => addBrand(word)}
            emptyMessage='No Brands Added'
            list={Brands}
            removeHandler={(word) => removeBrand(word)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
