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
import { useEffect, useState } from 'react';
import { KeywordPositiveNegativeWords } from './components/KeywordPositiveNegativeWords';
import { KeywordResearchCityComponent } from './components/KeywordResearchCityComponent';
import { KeywordExtraPositive } from './components/KeywordExtraPositiveComponent';
import { CustomCard } from '@/components/CustomCard';
import { useRegionStore } from './context/RegionsStore';

export const KeywordResearchForm = () => {
  // --> Inicializacion del formulario
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
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

  const selectedCountries = useRegionStore((st) => st.selectedCountries);

  useEffect(() => {
    setValue('region', selectedCountries);
  }, [setValue, selectedCountries]);

  return (
    <form
      className='mx-auto container max-w-7xl flex flex-col items-center gap-4'
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <KeywordResearchFormHeader />
      <KeywordResearchDetailsCard control={control} errors={errors} />
      <KeywordPositiveNegativeWords
        onSetNegative={(words) => setValue('negativeKeywords', words)}
        onSetPositive={(words) => setValue('positiveKeywords', words)}
      />

      <KeywordResearchCityComponent />
      <KeywordExtraPositive
        onSetExtraPositive={(value) => setValue('extraPositiveKeywords', value)}
      />

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
