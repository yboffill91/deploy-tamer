import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CustomCard } from '@/components/CustomCard';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import { Bell, Globe2, Languages, List, Tags } from 'lucide-react';
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
import {
  BrandsTooltipContent,
  CustomTooltipContent,
} from '@/components/CustomTooltipContentArray';
import { BrandsTrigger, RegionsTrigger } from './RegionsTrigguer';
import { BrandsSelectorComponent } from './BrandsSelectorComponent';

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
    <CustomCard
      title='Research Details'
      icon={List}
      action={
        <Button type='button' size={'icon'} variant={'outline'}>
          <Bell />
        </Button>
      }
    >
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
          <CustomSheet
            title='Generate and Select Brands'
            description='Generate and select the brands associated with your Keyword Research using artificial intelligence'
            trigger={<BrandsTrigger icon={Tags} label='Brands' />}
            tooltipContentElement={<BrandsTooltipContent />}
          >
            <BrandsSelectorComponent />
          </CustomSheet>
        </div>
      </div>
    </CustomCard>
  );
};
