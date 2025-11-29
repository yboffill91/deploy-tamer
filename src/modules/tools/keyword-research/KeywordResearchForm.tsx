'use client';

import { Controller, useForm } from 'react-hook-form';
import { KeywordResearchFormInput, KeywordResearchSchema } from '../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  KeywordResearchDetailsCard,
  KeywordResearchFormHeader,
} from './components';
import { Button, Label, RadioGroup, RadioGroupItem } from '@/components/ui';
import { Focus, Send } from 'lucide-react';
import { useEffect } from 'react';
import { KeywordPositiveNegativeWords } from './components/KeywordPositiveNegativeWords';
import { KeywordResearchCityComponent } from './components/KeywordResearchCityComponent';
import { KeywordExtraPositive } from './components/KeywordExtraPositiveComponent';
import { CustomCard } from '@/components/CustomCard';
import { useRegionStore } from '@/modules/tools/keyword-research/context/RegionStore';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from './context/WordsStoreFactory';

export const KeywordResearchForm = () => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<KeywordResearchFormInput>({
    resolver: zodResolver(KeywordResearchSchema),
    mode: 'onBlur',
    defaultValues: {
      allCitys: false,
      brand: [],
      city: [],
      companyId: 0,
      extraPositiveKeywords: [],
      generatedNegativeKeywords: [],
      generatedPositiveKeywords: [],
      negativeKeywords: [],
      positiveKeywords: [],
      region: [],
      requestLanguage: 'EN',
      searchVolume: '0',
      title: '',
      type: 'TRANSACTIONAL',
    },
  });

  const onSubmitHandler = (data: KeywordResearchFormInput) => {
    console.log(data);
  };

  const finalValues = useRegionStore((st) => st.finalValue);
  const negativeCities = useRegionStore((st) => st.negativeCities);
  const positiveWords = usePositiveStore((st) => st.words);
  const negativeWords = useNegativeStore((st) => st.words);
  const brands = useBrandStore((st) => st.words);
  const extraPositiveWords = useExtraPositiveStore((st) => st.words);

  const selectedRegions = Array.from(finalValues, ([key, value]) => ({
    key,
    value,
  }));

  useEffect(() => {
    const regionValues = selectedRegions.map((region) =>
      region.value.join(', ')
    );
    setValue('region', regionValues);
    setValue('city', negativeCities);
    setValue('positiveKeywords', positiveWords);
    setValue('negativeKeywords', negativeWords);
    setValue('extraPositiveKeywords', extraPositiveWords);

    setValue('brand', brands);
  }, [
    setValue,
    selectedRegions,
    negativeCities,
    positiveWords,
    negativeWords,
    brands,
    extraPositiveWords,
  ]);

  return (
    <form
      className='mx-auto container max-w-7xl flex flex-col items-center gap-4'
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <KeywordResearchFormHeader />
      <KeywordResearchDetailsCard control={control} errors={errors} />
      <KeywordPositiveNegativeWords />

      <KeywordExtraPositive />
      <KeywordResearchCityComponent />

      <CustomCard title='Search Intent' icon={Focus} variant='banner'>
        <div className='grid grid-cols-2  '>
          <div>
            <Controller
              control={control}
              name='type'
              render={({ field }) => {
                return (
                  <RadioGroup {...field} onValueChange={field.onChange}>
                    <div className='flex items-center gap-3'>
                      <RadioGroupItem
                        value='TRANSACTIONAL'
                        id='transactional'
                      />
                      <Label htmlFor='transactional'>Transactional</Label>
                    </div>
                    <div className='flex items-center gap-3'>
                      <RadioGroupItem
                        value='INFORMATIONAL'
                        id='informational'
                      />
                      <Label htmlFor='informational'>Informational</Label>
                    </div>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className=' flex items-center justify-start'>
            <Button
              type='submit'
              className=' w-full '
              size={'lg'}
              disabled={!isValid}
              variant={isValid ? 'default' : 'ghost'}
            >
              <Send />
              Run Research
            </Button>
          </div>
        </div>
      </CustomCard>
    </form>
  );
};
