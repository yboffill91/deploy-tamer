import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CustomCard } from '@/components/CustomCard';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import { Bell, Bot, Globe2, Languages, List, Plus, Tags } from 'lucide-react';
import { KeywordResearchFormInput } from '../../utils/models';
import {
  Badge,
  Button,
  ButtonGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetTrigger,
} from '@/components/ui';
import { useEffect, useState } from 'react';

import { showToast } from '@/components/CustomToaster';
import { useRegionStore } from '../context/NewRegionStore';
import { CustomSheet } from '@/components/CustomSheet';
import {
  CitiesSelector,
  CountrySelector,
  RegionStepController,
  StateSelector,
} from './regions-selector';
import { CustomTooltipContent } from '@/components/CustomTooltipContentArray';
import { RegionsTrigguer } from './RegionsTrigguer';
import { useBrandStore } from '../context/BrandsStore';
import { CustomWordsComponent } from './CustomWordsComponent';
import { CreateSuggestDTO } from '@/core/dto';
import { CustomLoading } from '@/components/CustomLoading';

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
  const Brands = useBrandStore((st) => st.brands);

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
                    className='cursor-pointer w-full bg-primary! text-primary-foreground'
                    type='button'
                  >
                    <Languages className='text-primary-foreground' />
                    <SelectValue placeholder='Select Language' />
                  </SelectTrigger>
                  <SelectContent className='bg-primary text-primary-foreground'>
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
              <RegionsTrigguer
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
            title='Generate Brands'
            description='Use our IA to generate Brands'
            tooltipContentElement={
              Brands.length === 0
                ? 'No Brands Selected'
                : Brands.map((brand, idx) => (
                    <Badge key={brand + idx}>{brand}</Badge>
                  ))
            }
            trigger={<BrandsTrigguer />}
            showClose
          >
            <BrandsSelector />
          </CustomSheet>
        </div>
      </div>
    </CustomCard>
  );
};

const BrandsTrigguer = () => {
  return (
    <>
      <ButtonGroup className='w-full'>
        <Button type='button' className='w-full' asChild>
          <SheetTrigger>
            <Tags />
            Brands
          </SheetTrigger>
        </Button>
      </ButtonGroup>
    </>
  );
};

const BrandsSelector = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [duplicatedWordsError, setDuplicatedWordsError] = useState<
    string | null
  >(null);

  const Generate = useBrandStore((st) => st.getSuggestedBrands);
  const SuggestedBrands = useBrandStore((st) => st.brands);
  const isLoading = useBrandStore((st) => st.isLoading);
  const isError = useBrandStore((st) => st.isError);
  const setBrands = useBrandStore((st) => st.setBrands);
  const deleteBrand = useBrandStore((st) => st.deleteBrand);
  useEffect(() => {
    if (duplicatedWordsError) {
      showToast({
        type: 'error',
        description: duplicatedWordsError,
        message: 'Error',
      });
    }
  }, [duplicatedWordsError]);

  const onKeywordAdd = (keyword: string) => {
    setBrands(keyword);
    setKeyword('');
  };

  const handleDelete = (keyword: string) => {
    deleteBrand(keyword);
  };

  const onHandleGenerate = () => {
    const payLoad = new CreateSuggestDTO(SuggestedBrands);
    console.log(payLoad);
    Generate(payLoad);
  };

  useEffect(() => {
    if (isError) {
      showToast({
        type: 'error',
        description: isError,
        message: 'Error',
      });
    }
  }, [isError]);

  return (
    <div className='min-h-[70dvh] h-full  flex flex-col gap-2'>
      <CustomWordsComponent
        emptyMessageWorldsContainer='No Keywords Added to Run the Suggest'
        inputHandleOnClick={() => onKeywordAdd(keyword)}
        onDeleteWorldsContainer={(keyword) => handleDelete(keyword)}
        inputOnChangeValue={(e) => setKeyword(e.target.value)}
        inputValue={keyword}
        list={SuggestedBrands}
      />
      <div className='flex items-center'>
        <Button
          type='button'
          disabled={SuggestedBrands.length === 0}
          onClick={() => onHandleGenerate()}
          className='flex-1'
        >
          <Bot /> {isLoading && <CustomLoading message='thinking' />}
          {!isLoading && `Generate`}
        </Button>
      </div>
    </div>
  );
};
