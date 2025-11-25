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
import { BrandsEntity, CountriesEntity } from '@/core/entities';
import {
  BrandApiRepository,
  CitiesRepository,
} from '@/infrastructure/repositories';
import { CustomLoading } from '@/components/CustomLoading';
import { showToast } from '@/components/CustomToaster';
import { CustomRegionSelector } from './CustomRegionSelector';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CustomBrandsSelector } from './CustomBrandsSelector';

interface Props {
  control: Control<KeywordResearchFormInput>;
  errors: FieldErrors<KeywordResearchFormInput>;
  onSelectedRegion(region: CountriesEntity): void;
  onSelectedBrands(brands: BrandsEntity[]): void;
}

export const KeywordResearchDetailsCard = ({
  control,
  errors,
  onSelectedRegion,
  onSelectedBrands,
}: Props) => {
  const [regions, setRegions] = useState<CountriesEntity[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<CountriesEntity>();
  const [showDialog, setShowDialog] = useState(false);
  const [brands, setBrands] = useState<BrandsEntity[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<BrandsEntity[]>([]);

  useEffect(() => {
    const getData = async () => {
      const REGIONS_REPO = new CitiesRepository();
      const BRANDS_REPO = new BrandApiRepository();
      try {
        setIsLoadingRegions(true);
        setIsBrandsLoading(true);
        const fetched_regions = await REGIONS_REPO.findCuntries();
        const fetched_brands = await BRANDS_REPO.findAll();

        setRegions(fetched_regions);
        setBrands(fetched_brands);
      } catch (error) {
        setIsError(
          error instanceof Error
            ? error.message
            : `Error fetching data : ${error as string}`
        );
      } finally {
        setIsLoadingRegions(false);
        setIsBrandsLoading(false);
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
        <div className='grid grid-cols-3 w-full lg:max-w-sm  gap-2'>
          <Controller
            control={control}
            name='requestLanguage'
            render={({ field }) => (
              <div>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    value={field.value}
                    className='cursor-pointer w-full bg-secondary! text-secondary-foreground'
                    type='button'
                  >
                    <Languages className='text-secondary-foreground' />
                    <SelectValue placeholder='Select Language' />
                  </SelectTrigger>
                  <SelectContent className='bg-secondary text-secondary-foreground'>
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
                <Button
                  asChild
                  type='button'
                  variant={'secondary'}
                  disabled={isLoadingRegions}
                >
                  <SheetTrigger>
                    {isLoadingRegions ? (
                      <CustomLoading message='Regions' />
                    ) : (
                      <>
                        <Globe2 /> Region{' '}
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
          <Tooltip>
            <TooltipTrigger type='button' asChild>
              <Button
                type='button'
                onClick={() => setShowDialog(!showDialog)}
                disabled={isBrandsLoading}
                variant={'secondary'}
              >
                {isBrandsLoading ? (
                  <CustomLoading message='Brands' />
                ) : (
                  <>
                    <Tags /> Brands{' '}
                    {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className='flex items-center justify-center gap-2'>
              {selectedBrands.length === 0 && 'No Brands Selected'}
              {selectedBrands.length > 0 &&
                selectedBrands.map((brand, index) => (
                  <span key={brand.id}>
                    {brand.name!} {index !== selectedBrands.length - 1 && '|'}
                  </span>
                ))}
            </TooltipContent>
          </Tooltip>
          <ControlledDialog
            title='Select Brand'
            description='Pick registred brands to include in the keyword research'
            onOpenChange={setShowDialog}
            open={showDialog}
          >
            <CustomBrandsSelector
              brands={brands}
              preSelectedBrands={selectedBrands}
              onFinishSelection={(newSelectedBrands) => {
                setSelectedBrands(newSelectedBrands);
                onSelectedBrands(newSelectedBrands);
                setShowDialog(false);
              }}
            />
          </ControlledDialog>
        </div>
      </div>
    </CustomCard>
  );
};
