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
  // const hidrateRegions = useFormStore((st) => st.regions);
  const brands = useBrandStore((st) => st.words);
  const errorLoadingData = useFormStore((st) => st.error);
  const extraPositiveWords = useExtraPositiveStore((st) => st.words);
  const finalValues = useRegionStore((st) => st.finalValue);
  const getInitialValues = useFormStore((st) => st.getInitialValues);
  const hidrateBrands = useBrandStore((st) => st.hidrateWords);
  const hidrateExtraPositive = useExtraPositiveStore((st) => st.hidrateWords);
  const hidrateNegative = useNegativeStore((st) => st.hidrateWords);
  const hidrateNegativeCities = useFormStore((st) => st.city);
  const hidratePositive = usePositiveStore((st) => st.hidrateWords);
  const initialValues = getInitialValues();
  const isLoading = useFormStore((st) => st.isLoading);
  const keywordResearch = useFormStore((st) => st.keywordResearch);
  const mode = useFormStore((st) => st.mode);
  const negativeCities = useRegionStore((st) => st.negativeCities);
  const negativeWords = useNegativeStore((st) => st.words);
  const positiveWords = usePositiveStore((st) => st.words);
  const resetBrands = useBrandStore((st) => st.resetWords);
  const resetExtraPositive = useExtraPositiveStore((st) => st.resetWords);
  const resetNegative = useNegativeStore((st) => st.resetWords);
  const resetNegativeCities = useRegionStore((st) => st.resetNegativesCities);
  const resetWords = usePositiveStore((st) => st.resetWords);
  const setMode = useFormStore((st) => st.setMode);

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
    trigger,
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

    const updatePayload: Partial<KeywordResearchFormInput> = {
      ...payload,
    };
    const REPO = new KeywordResearchApiRepository();
    try {
      if (mode === 'edit') {
        await REPO.update(String(keywordResearch.id), updatePayload);
        showToast({
          message: 'Updated  Keyword Research',
          type: 'success',
          description: '',
        });
      } else {
        await REPO.create(payload);
        showToast({
          message: 'Created New Keyword Research',
          type: 'success',
          description: '',
        });
      }
      setMode('create');
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
      if (Array.isArray(initialValues.city)) hidrateNegativeCities();

      reset(getInitialValues());
      trigger();
    }

    if (mode === 'create' && keywordResearch) {
      const generatedWords =
        keywordResearch.generatedPositiveKeywords?.map((el) => el.keyword) ||
        [];

      if (generatedWords.length > 0) {
        hidratePositive(generatedWords);
      }

      if (Array.isArray(keywordResearch.negativeKeywords))
        hidrateNegative(keywordResearch.negativeKeywords);
      if (Array.isArray(keywordResearch.extraPositiveKeywords))
        hidrateExtraPositive(keywordResearch.extraPositiveKeywords);
      if (Array.isArray(keywordResearch.brand))
        hidrateBrands(keywordResearch.brand);
      if (Array.isArray(keywordResearch.city)) hidrateNegativeCities(); // Usar la entidad, no initialValues.city

      reset(getInitialValues());
    }
  }, [
    keywordResearch,
    mode,
    reset,
    trigger, // Añadir trigger
    getInitialValues,
    hidratePositive,
    hidrateNegative,
    hidrateExtraPositive,
    hidrateBrands,
    hidrateNegativeCities,
  ]);

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
