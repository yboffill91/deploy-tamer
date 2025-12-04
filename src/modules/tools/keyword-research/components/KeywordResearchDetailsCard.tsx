import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CustomCard } from '@/components/CustomCard';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import { Bell, Globe2, Languages, List } from 'lucide-react';
import { KeywordResearchFormInput } from '../../utils/models';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useEffect } from 'react';

import { showToast } from '@/components/CustomToaster';
import { useRegionStore } from '../context/RegionStore';
import { CustomSheet } from '@/components/CustomSheet';
import {
  CitiesSelector,
  CountrySelector,
  RegionStepController,
  StateSelector,
} from './regions-selector';
import { CustomTooltipContent } from '@/components/CustomTooltipContentArray';
import { RegionsTrigger } from './RegionsTrigguer';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from '../context/WordsStoreFactory';

interface Props {
  control: Control<KeywordResearchFormInput>;
  errors: FieldErrors<KeywordResearchFormInput>;
}

export const KeywordResearchDetailsCard = ({ control, errors }: Props) => {
  const regions = useRegionStore((state) => state.allCountries);
  const getCountries = useRegionStore((state) => state.getAllCountries);
  const isError = useRegionStore((st) => st.error);
  const isLoadingRegions = useRegionStore((st) => st.isLoading);
  const Step = useRegionStore((st) => st.step);
  const isLoadingBrands = useBrandStore((st) => st.isLoading);

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  useEffect(() => {
    if (isError) {
      showToast({
        description: isError,
        message: 'Error',
        type: 'error',
      });
    }
  }, [isError]);

  return (
    <CustomCard title='Research Details' icon={List} action={<Notifications />}>
      <div className='flex flex-col lg:flex-row items-start justify-start gap-2'>
        <div className='grid grid-cols-12 gap-2 w-full lg:w-3xl'>
          <div className=' col-span-10'>
            <CustomControllerInput
              control={control}
              name='title'
              placeholder='Title for your Keyword Research'
              error={errors.title}
            />
          </div>

          <div className='col-span-2'>
            <CustomControllerInput
              type='number'
              control={control}
              name='searchVolume'
              placeholder='Volume of Search'
              error={errors.searchVolume}
            />
          </div>
        </div>
        <div className='grid grid-cols-3 w-full lg:w-md gap-2'>
          <Controller
            control={control}
            name='requestLanguage'
            render={({ field }) => (
              <div>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    value={field.value}
                    className='cursor-pointer w-full bg-secondary! border-none shadow-sm '
                    type='button'
                  >
                    <Languages className='' />
                    <SelectValue placeholder='Select Language' />
                  </SelectTrigger>
                  <SelectContent className=' '>
                    <SelectItem value='EN'>English</SelectItem>
                    <SelectItem value='ES'>Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <CustomSheet
            title='Select Region'
            description='  You can find and add Search for regions like countries, states
                or cities'
            trigger={
              <RegionsTrigger
                icon={Globe2}
                label='Region'
                loadingState={isLoadingRegions}
              />
            }
            tooltipContentElement={<CustomTooltipContent />}
          >
            <RegionStepController />
            {Step === 'Country' && <CountrySelector data={regions} />}
            {Step === 'State' && <StateSelector />}
            {Step === 'Cities' && <CitiesSelector />}
          </CustomSheet>
          <GenerateWordsWithAiButton
            type='Brands'
            isLoading={isLoadingBrands}
          />
        </div>
      </div>
    </CustomCard>
  );
};

const Notifications = () => {
  const isFinishedWords = usePositiveStore((st) => st.isFinished);
  const isFinishedNegative = useNegativeStore((st) => st.isFinished);
  const isFinishedExtra = useExtraPositiveStore((st) => st.isFinished);
  const isFinishedBrands = useBrandStore((st) => st.isFinished);

  console.log(
    isFinishedBrands,
    isFinishedExtra,
    isFinishedNegative,
    isFinishedWords
  );
  return (
    <div className='relative'>
      {!isFinishedBrands &&
      !isFinishedWords &&
      !isFinishedExtra &&
      !isFinishedNegative ? (
        <Button type='button' size={'icon'} variant={'outline'} disabled>
          <Bell />
        </Button>
      ) : (
        <>
          <Button
            type='button'
            size={'icon'}
            variant={'outline'}
            className=' text-green-700'
          >
            <Bell />
          </Button>
          <span className='rounded-full size-3  absolute -top-1 -right-1 bg-green-500/50 animate-ping' />
          <span className='rounded-full size-2    absolute -top-0.5 -right-0.5 bg-green-500 ' />
        </>
      )}
    </div>
  );
};
