'use client';
import { CustomCard } from '@/components/CustomCard';
import {
  Button,
  ButtonGroup,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  AlertTriangle,
  Check,
  CheckCheck,
  ChevronRight,
  FilterX,
  MapPin,
  Search,
} from 'lucide-react';
import { WordsContainer } from './WordsContainer';
import { useRegionStore } from '../context/RegionStore';
import { CustomSheet } from '@/components/CustomSheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const KeywordResearchCityComponent = () => {
  const Cities = useRegionStore((st) => st.cumulativeSelectedCities);

  const selectedNegativeCities = useRegionStore((st) => st.negativeCities);
  const setSelectedNegativeCities = useRegionStore(
    (st) => st.setNegativeCities
  );

  return (
    <CustomCard
      title='Cities Filter'
      icon={MapPin}
      disabled={Cities.length === 0}
    >
      <div className='flex flex-col gap-6 w-full'>
        <div className='w-full flex gap-2 items-center'>
          <CustomSheet
            description='Add Cities To Negative Keywords'
            title='Select Cities'
            showClose
            trigger={
              <ButtonGroup className='w-full'>
                <Button
                  asChild
                  type='button'
                  className='w-full justify-start flex text-muted-foreground '
                  variant='outline'
                >
                  <SheetTrigger className='w-full '>
                    <div className='w-full flex items-center justify-between'>
                      <span className='flex gap-2 items-center'>
                        <Search /> Select Cities
                      </span>{' '}
                      <ChevronRight />{' '}
                    </div>{' '}
                  </SheetTrigger>
                </Button>
              </ButtonGroup>
            }
            tooltipContentElement={'Under Construction'}
          >
            <CitiesSelector />
          </CustomSheet>
        </div>
        <WordsContainer
          message='No Cities Added'
          list={selectedNegativeCities}
          onDelete={(word) => setSelectedNegativeCities(word)}
        />
      </div>
    </CustomCard>
  );
};

const CitiesSelector = () => {
  const Cities = useRegionStore((st) => st.cumulativeSelectedCities);
  const negativeCities = useRegionStore((st) => st.negativeCities);
  const selectedNegativeCities = useRegionStore((st) => st.setNegativeCities);

  const [filter, setFilter] = useState('');

  const filteredCities = Cities.filter((city) =>
    city.toLowerCase().includes(filter)
  );

  return (
    <div className='flex flex-col items-start gap-2'>
      {Cities.length > 7 && (
        <InputGroup>
          <InputGroupInput
            placeholder='Filter by City Name'
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
      {filteredCities.length > 0 && (
        <div className='max-h-[70dvh] h-full overflow-y-scroll'>
          <Table className=' text-left'>
            <TableHeader>
              <TableRow className='border-b'>
                <TableHead className='p-2 w-48'>
                  <span className='flex items-center gap-2 cursor-pointer'>
                    City
                  </span>
                </TableHead>
                <TableHead className='p-2'>Selected</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCities.map((el, idx) => (
                <TableRow
                  key={el + idx}
                  className={cn(
                    'cursor-pointer',
                    negativeCities.includes(el) && 'bg-green-500/20'
                  )}
                  onClick={() => selectedNegativeCities(el)}
                >
                  <TableCell className='w-48'>{el}</TableCell>
                  <TableCell className='flex items-center justify-start'>
                    {negativeCities.includes(el) ? (
                      <CheckCheck className='size-4' />
                    ) : (
                      <Check className='size-4' />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {filteredCities.length === 0 && (
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
    </div>
  );
};
