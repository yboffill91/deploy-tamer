'use client';

import { useForm } from 'react-hook-form';
import { KeywordResearchFormInput, KeywordResearchSchema } from '../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  KeywordResearchDetailsCard,
  KeywordResearchFormHeader,
} from './components';
import { Button } from '@/components/ui';
import { Send } from 'lucide-react';
import { useState } from 'react';

export const KeywordResearchForm = () => {
  const [countryCode, setcountryCode] = useState<string>('US');
  // --> Inicializacion del formulario
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
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
      region: 'United States',
      requestLanguage: 'EN',
      searchVolume: '0',
      title: '',
      type: 'TRANSACTIONAL',
    },
  });

  console.log(countryCode);

  const onSubmitHandler = (data: KeywordResearchFormInput) => {
    console.log(data);
  };

  return (
    <form
      className='mx-auto container max-w-7xl flex flex-col items-center gap-4'
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <KeywordResearchFormHeader />
      <KeywordResearchDetailsCard
        control={control}
        errors={errors}
        onSelectedRegion={(region) => {
          setValue('region', region.name);
          setcountryCode(region.iso2!);
        }}
      />

      <div className='w-full flex items-center justify-center'>
        <Button type='submit' className='mt-4  w-full max-w-xl' size={'lg'}>
          <Send />
          Run Research
        </Button>
      </div>
    </form>
  );
};
