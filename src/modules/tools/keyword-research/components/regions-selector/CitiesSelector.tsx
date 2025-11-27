'use client';

import { useEffect, useState } from 'react';
import { useRegionStore } from '../../context/NewRegionStore';
import { showToast } from '@/components/CustomToaster';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { CitiesEntity, StatesEntity } from '@/core/entities';
import {
  Button,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Search,
  FilterX,
  CheckCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const CitiesSelector = () => {
  const Cities = useRegionStore((st) => st.citiesByState);
  const getCities = useRegionStore((st) => st.getCities);
  const loadingStates = useRegionStore((st) => st.isLoading);
  const isError = useRegionStore((st) => st.error);

  useEffect(() => {
    getCities();
  }, [getCities]);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error',
        description: isError,
        type: 'error',
      });
    }
  });

  return (
    <>
      {loadingStates && <CustomPageLoader message='loading cities' />}
      {!loadingStates && Cities && (
        <>
          <CitiesSelectorTable data={Cities} />
        </>
      )}
    </>
  );
};

const CitiesSelectorTable = ({ data }: { data: CitiesEntity[] }) => {
  const selectedCities = useRegionStore((st) => st.selectedCities);
  const setSelectedCities = useRegionStore((st) => st.setSelectedCities);

  const [filter, setFilter] = useState<string>('');

  const filteredData = data.filter((el) =>
    el.name.toLowerCase().includes(filter.toLowerCase())
  );

  const onClickHandler = (el: StatesEntity) => {
    setSelectedCities(el);
  };

  return (
    <>
      {data.length > 7 && (
        <InputGroup>
          <InputGroupInput
            placeholder='Filter by State'
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupButton
            onClick={() => setFilter('')}
            className={cn(filter.length === 0 && 'hidden')}
          >
            <FilterX />
          </InputGroupButton>
        </InputGroup>
      )}
      {filteredData.length > 0 && (
        <Table className=' text-left'>
          <TableHeader>
            <TableRow className='border-b'>
              <TableHead className='p-2 w-48'>
                <span className='flex items-center gap-2 cursor-pointer'>
                  State
                </span>
              </TableHead>
              <TableHead className='p-2'>Selected</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((el) => (
              <TableRow
                key={el.id}
                className={cn(
                  'cursor-pointer',
                  selectedCities.includes(el.name) && 'bg-green-500/20'
                )}
                onClick={() => onClickHandler(el)}
              >
                <TableCell className='w-48'>{el.name}</TableCell>
                <TableCell className='flex items-center justify-start'>
                  {selectedCities.includes(el.name) ? (
                    <CheckCheck className='size-4' />
                  ) : (
                    <Check className='size-4' />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {filteredData.length === 0 && (
        <Empty>
          <EmptyMedia variant='icon'>
            <AlertTriangle />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className='capitalize'>
              No data found for {filter}
            </EmptyTitle>
          </EmptyHeader>
          <Button
            type='button'
            className='w-full'
            variant='outline'
            onClick={() => setFilter('')}
          >
            Clear Filter
          </Button>
        </Empty>
      )}
    </>
  );
};
