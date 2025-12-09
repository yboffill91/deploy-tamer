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
import { useRegionStore } from '@/modules/tools/keyword-research/context/RegionStore';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from './context/WordsStoreFactory';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories/KaywordResearchApiRepository';
import { showToast } from '@/components/CustomToaster';
import { CustomLoading } from '@/components/CustomLoading';
import { useFormStore } from './context/FormStore';
import { CustomPageLoader } from '@/components/CustomPageLoader';

export const KeywordResearchForm = () => {
  const [isError, setIsError] = useState('');
  const resetWords = usePositiveStore((st) => st.resetWords);
  const hidratePositive = usePositiveStore((st) => st.hidrateWords);
  const resetNegative = useNegativeStore((st) => st.resetWords);
  const hidrateNegative = useNegativeStore((st) => st.hidrateWords);
  const resetExtraPositive = useExtraPositiveStore((st) => st.resetWords);
  const hidrateExtraPositive = useExtraPositiveStore((st) => st.hidrateWords);
  const resetBrands = useBrandStore((st) => st.resetWords);
  const hidrateBrands = useBrandStore((st) => st.hidrateWords);
  const resetNegativeCities = useRegionStore((st) => st.resetNegativesCities);
  // const hidrateRegions = useFormStore((st) => st.regions);
  const hidrateNegativeCities = useFormStore((st) => st.city);
  const errorLoadingData = useFormStore((st) => st.error);
  const getInitialValues = useFormStore((st) => st.getInitialValues);
  const isLoading = useFormStore((st) => st.isLoading);
  const keywordResearch = useFormStore((st) => st.keywordResearch);
  const mode = useFormStore((st) => st.mode);
  const finalValues = useRegionStore((st) => st.finalValue);
  const negativeCities = useRegionStore((st) => st.negativeCities);
  const positiveWords = usePositiveStore((st) => st.words);
  const negativeWords = useNegativeStore((st) => st.words);
  const brands = useBrandStore((st) => st.words);
  const extraPositiveWords = useExtraPositiveStore((st) => st.words);
  const initialValues = getInitialValues();

  const selectedRegions = Array.from(finalValues, ([key, value]) => ({
    key,
    value,
  }));

  const regionValues = selectedRegions.map((region) => region.value.join(', '));

  const resetForm = () => {
    reset();
    resetWords();
    resetNegative();
    resetExtraPositive();
    resetBrands();
    resetNegativeCities();
  };

  // --> Inicializacoin del formulario
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<KeywordResearchFormInput>({
    resolver: zodResolver(KeywordResearchSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  // Submit handler
  const onSubmitHandler = async (data: KeywordResearchFormInput) => {
    const payload = {
      ...data,
      region: regionValues,
      city: negativeCities,
      positiveKeywords: positiveWords,
      negativeKeywords: negativeWords,
      extraPositiveKeywords: extraPositiveWords,
      brand: brands,
    };
    const REPO = new KeywordResearchApiRepository();
    try {
      await REPO.create(payload);
      showToast({
        message: 'Created New Keyword Research',
        type: 'success',
        description: '',
      });
      resetForm();
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Submiting The Form'
      );
    }
  };
  useEffect(() => {
    if (mode === 'edit' && keywordResearch) {
      if (Array.isArray(initialValues.positiveKeywords))
        hidratePositive(initialValues.positiveKeywords);
      if (Array.isArray(initialValues.negativeKeywords))
        hidrateNegative(initialValues.negativeKeywords);
      if (Array.isArray(initialValues.extraPositiveKeywords))
        hidrateExtraPositive(initialValues.extraPositiveKeywords);
      if (Array.isArray(initialValues.brand))
        hidrateBrands(initialValues.brand);
      // if (Array.isArray(initialValues.region)) hidrateRegions();
      if (Array.isArray(initialValues.city)) hidrateNegativeCities();

      reset(getInitialValues());
    }
  }, [keywordResearch, mode, reset, getInitialValues]);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error',
        description: isError,
        type: 'error',
      });
    }
    if (errorLoadingData) {
      showToast({
        message: 'Error',
        description: errorLoadingData,
        type: 'error',
      });
    }
  }, [isError, errorLoadingData]);

  return (
    <>
      {mode === 'edit' && isLoading ? (
        <CustomPageLoader message='Fetching Form Data to Edit' />
      ) : (
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
                  disabled={!isValid && positiveWords.length === 0}
                  variant={
                    isValid && positiveWords.length > 0 ? 'default' : 'ghost'
                  }
                >
                  {isSubmitting ? (
                    <CustomLoading message='Creating Research' />
                  ) : (
                    <>
                      <Send />
                      Run Research{' '}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CustomCard>
        </form>
      )}
    </>
  );
};
