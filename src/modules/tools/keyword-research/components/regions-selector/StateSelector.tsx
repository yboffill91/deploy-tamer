'use client';

import { useEffect, useState } from 'react';
import { useRegionStore } from '../../context/NewRegionStore';
import { showToast } from '@/components/CustomToaster';
import { CustomPageLoader } from '@/components/CustomPageLoader';
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
import { StatesEntity } from '@/core/entities';
import { cn } from '@/lib/utils';
import {
  Search,
  FilterX,
  CheckCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const StateSelector = () => {
  const States = useRegionStore((st) => st.countryStates);
  const getStates = useRegionStore((st) => st.getStates);
  const loadingStates = useRegionStore((st) => st.isLoading);
  const isError = useRegionStore((st) => st.error);

  useEffect(() => {
    getStates();
  }, [getStates]);

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
      {loadingStates && <CustomPageLoader message='loading states' />}
      {!loadingStates && States && (
        <>
          <StateSelectorTable data={States} />
        </>
      )}
    </>
  );
};

const StateSelectorTable = ({ data }: { data: StatesEntity[] }) => {
  const setStateCode = useRegionStore((st) => st.setSelectedState);
  const selectedState = useRegionStore((st) => st.selectedState);
  const setSelectedState = useRegionStore((st) => st.setSelectedStateCode);

  const [filter, setFilter] = useState<string>('');

  const filteredData = data.filter((el) =>
    el.name.toLowerCase().includes(filter.toLowerCase())
  );

  const onClickHandler = (el: StatesEntity) => {
    setStateCode(el);
    setSelectedState(el);
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
                  selectedState === el.name && 'bg-green-500/20'
                )}
                onClick={() => onClickHandler(el)}
              >
                <TableCell className='w-48'>{el.name}</TableCell>
                <TableCell className='flex items-center justify-start'>
                  {selectedState === el.name ? (
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
