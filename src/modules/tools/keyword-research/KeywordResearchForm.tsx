'use client';

import { Controller, useForm } from 'react-hook-form';
import { KeywordResearchFormInput, KeywordResearchSchema } from '../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  KeywordResearchDetailsCard,
  KeywordResearchFormHeader,
} from './components';
import {
  Button,
  ButtonGroup,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui';
import { Focus, RefreshCw, Save, SendHorizonal } from 'lucide-react';
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
import { KeywordStatus } from '@/core/entities';

export const KeywordResearchForm = () => {
  const [isError, setIsError] = useState('');
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
  const deleteKeywordReserch = useFormStore((st) => st.resetKeywordResearch);
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
  const resetRegions = useRegionStore((st) => st.resetFinalValue);
  const clearKeywordResearch = useFormStore((st) => st.clearKeywordResearch);
  const hidrateRegions = useFormStore((st) => st.regions);
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
    resetRegions();
    clearKeywordResearch();
  };

  const resetFormAfterEdit = () => {
    reset(getInitialValues());
    deleteKeywordReserch();
    resetWords();
    resetNegative();
    resetExtraPositive();
    resetBrands();
    resetNegativeCities();
    resetRegions();
    clearKeywordResearch();
  };
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

  const onSubmitHandler = async (data: KeywordResearchFormInput) => {
    if (positiveWords.length === 0) {
      showToast({
        type: 'error',
        message: 'Error validating the form. ',
        description: 'Positive keywords are required',
      });
      return;
    }

    if (regionValues.length === 0) {
      showToast({
        type: 'error',
        message: 'Error validating the form.',
        description: 'Region is required',
      });
      return;
    }
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
      if (mode === 'edit') {
        await REPO.runKeyword(String(keywordResearch.id));
        showToast({
          message: 'Keyword Research relaunched',
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
      if (Array.isArray(initialValues.region)) hidrateRegions();
      reset(getInitialValues());
      trigger();
    }

    if (mode === 'create' && keywordResearch) {
      resetFormAfterEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    keywordResearch,
    mode,
    reset,
    trigger,
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
          className='mx-auto container max-w-7xl flex flex-col items-center gap-4 relative'
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
                <ButtonGroup className='w-full'>
                  <Button
                    type='submit'
                    className=' w-full flex-1 '
                    size={'lg'}
                    disabled={
                      !isValid ||
                      positiveWords.length === 0 ||
                      regionValues.length === 0
                    }
                    variant={
                      isValid &&
                      positiveWords.length > 0 &&
                      regionValues.length > 0
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {isSubmitting ? (
                      <CustomLoading message='Creating Research' />
                    ) : (
                      <>
                        {mode === 'create' ? (
                          <>
                            <Save />
                            Save{' '}
                          </>
                        ) : (
                          <>
                            <SendHorizonal />
                            {keywordResearch.status !== KeywordStatus.DRAFT &&
                              'Re '}{' '}
                            Run Research
                          </>
                        )}
                      </>
                    )}
                  </Button>
                  {mode === 'edit' && (
                    <Button
                      onClick={() => {
                        resetForm();
                        setMode('create');
                      }}
                      type='reset'
                      size='lg'
                      variant='secondary'
                    >
                      <RefreshCw /> Reset Form
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            </div>
          </CustomCard>
        </form>
      )}
    </>
  );
};
