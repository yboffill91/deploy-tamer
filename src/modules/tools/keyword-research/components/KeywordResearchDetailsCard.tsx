import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CustomCard } from '@/components/CustomCard';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import { CheckCheck, Globe2, Languages, List, Tags } from 'lucide-react';
import { KeywordResearchFormInput } from '../../utils/models';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
  SheetClose,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui';
import { useEffect, useState } from 'react';
import { CountriesEntity } from '@/core/entities';
import { CitiesRepository } from '@/infrastructure/repositories';
import { CustomLoading } from '@/components/CustomLoading';
import { showToast } from '@/components/CustomToaster';
import { CustomRegionSelector } from './CustomRegionSelector';

interface Props {
  control: Control<KeywordResearchFormInput>;
  errors: FieldErrors<KeywordResearchFormInput>;
  onSelectedRegion(region: CountriesEntity): void;
}

export const KeywordResearchDetailsCard = ({
  control,
  errors,
  onSelectedRegion,
}: Props) => {
  const [regions, setRegions] = useState<CountriesEntity[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<CountriesEntity>();

  useEffect(() => {
    const getData = async () => {
      const REGIONS_REPO = new CitiesRepository();
      try {
        setIsLoadingRegions(true);
        const fetched_regions = await REGIONS_REPO.findCuntries();
        setRegions(fetched_regions);
      } catch (error) {
        setIsError(
          error instanceof Error
            ? error.message
            : `Error fetching data : ${error as string}`
        );
      } finally {
        setIsLoadingRegions(false);
      }
    };
    getData();
  }, []);

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
    <CustomCard title='Research Details' icon={List}>
      <div className='flex flex-col lg:flex-row items-start justify-center gap-2'>
        <div className='grid grid-cols-12 gap-2 w-full'>
          <div className=' col-span-9'>
            <CustomControllerInput
              control={control}
              name='title'
              placeholder='Title for your Keyword Research'
              error={errors.title}
            />
          </div>

          <div className='col-span-3'>
            <CustomControllerInput
              type='number'
              control={control}
              name='searchVolume'
              placeholder='Volume of Search'
              error={errors.searchVolume}
            />
          </div>
        </div>
        <div className='flex items-start justify-start gap-2'>
          <Controller
            control={control}
            name='requestLanguage'
            render={({ field }) => (
              <div>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    value={field.value}
                    className='cursor-pointer w-32 bg-primary! text-primary-foreground'
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
          <Sheet>
            <Tooltip>
              <TooltipTrigger asChild type='button'>
                <Button asChild type='button' disabled={isLoadingRegions}>
                  <SheetTrigger>
                    {isLoadingRegions ? (
                      <CustomLoading message='Getting Regions' />
                    ) : (
                      <>
                        <Globe2 /> Regions{' '}
                      </>
                    )}
                  </SheetTrigger>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='flex items-center justify-center gap-2'>
                {' '}
                <CheckCheck className='size-4' />
                {selectedRegion ? selectedRegion.name : 'United States'}
              </TooltipContent>
            </Tooltip>
            <SheetContent className='p-4'>
              <SheetHeader>
                <SheetTitle>Select Region</SheetTitle>
              </SheetHeader>
              <SheetDescription>
                You can find and add Search for regions like countries, states
                or cities
              </SheetDescription>
              <CustomRegionSelector
                regions={regions}
                onSelected={(el) => {
                  setSelectedRegion(el);
                  onSelectedRegion(el);
                }}
              />
              <SheetClose type='button' asChild>
                <Button type='button'>
                  {selectedRegion ? selectedRegion.name! : 'Finish Selection'}
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
          <Button type='button'>
            <Tags /> Brands
          </Button>
        </div>
      </div>
    </CustomCard>
  );
};
