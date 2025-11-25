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
    handleSubmit,
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
        onSelectedBrands={(brands) => {
          setValue(
            'brand',
            brands.map((brand) => brand.name!)
          );
        }}
      />
      <KeywordPositiveNegativeWords
        onSetNegative={(words) => setValue('negativeKeywords', words)}
        onSetPositive={(words) => setValue('positiveKeywords', words)}
      />

      <KeywordExtraPositive
        onSetExtraPositive={(value) => setValue('extraPositiveKeywords', value)}
      />
      {/* <KeywordResearchCityComponent /> */}

      <CustomCard title='Search Intent' icon={Focus} variant='banner'>
        <div className='grid grid-cols-2 gap-2'>
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
          <div className='w-full flex items-center justify-center'></div>
        </div>
      </CustomCard>

      <div className='w-full flex items-center justify-center'>
        <Button type='submit' className='mt-4  w-full max-w-xl' size={'lg'}>
          <Send />
          Run Research
        </Button>
      </div>
    </form>
  );
};
