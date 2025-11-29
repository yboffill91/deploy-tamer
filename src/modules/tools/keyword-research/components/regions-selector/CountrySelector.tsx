'use client';
import { CountriesEntity } from '@/core/entities';
import { useMemo, useState } from 'react';
import { useRegionStore } from '../../context/RegionStore';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  ChevronsUpDown,
  CheckCheck,
  Check,
} from 'lucide-react';

export const CountrySelector = ({ data }: { data: CountriesEntity[] }) => {
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [regionFilter, setRegionFilter] = useState('all');

  const regions = useMemo(() => {
    const set = new Set(data.map((el) => el.subregion));
    return ['all', ...Array.from(set).sort()];
  }, [data]);
  const filteredData = useMemo(() => {
    if (regionFilter === 'all') return data;
    return data.filter((el) => el.subregion === regionFilter);
  }, [data, regionFilter]);
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a.name! < b.name!) return sortNameAsc ? -1 : 1;
      if (a.name! > b.name!) return sortNameAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortNameAsc]);
  const [globalFilter, setGlobalFilter] = useState('');
  const filteredData2 = useMemo(() => {
    return sortedData.filter((el: CountriesEntity) =>
      el.name!.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [sortedData, globalFilter]);

  const selectedCountry = useRegionStore((st) => st.selectedCountryName);
  const setSelectedCountry = useRegionStore((st) => st.setSelectedCountryName);
  const setSelectedCountryCode = useRegionStore(
    (st) => st.setSelectedCountryCode
  );

  return (
    <>
      <div className='flex gap-4 mb-4'>
        <Select onValueChange={setRegionFilter} value={regionFilter}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Region' />
          </SelectTrigger>
          <SelectContent>
            {regions.map(
              (r, i) =>
                r?.length !== 0 && (
                  <SelectItem key={i} value={r!}>
                    <span className='capitalize'>{' ' + r!}</span>
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>
        <InputGroup className='w-48'>
          <InputGroupInput
            placeholder={`Search by Name...`}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            value={globalFilter}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupButton
            onClick={() => {
              setGlobalFilter('');
            }}
            disabled={globalFilter.length === 0}
          >
            <FilterX />
          </InputGroupButton>
        </InputGroup>
      </div>

      <Table className=' text-left w-72'>
        <TableHeader>
          <TableRow className='border-b'>
            <TableHead className='p-2 w-48'>
              <span
                onClick={() => setSortNameAsc(!sortNameAsc)}
                className='flex items-center gap-2 cursor-pointer'
              >
                Name
                <ChevronsUpDown className='w-4 h-4' />
              </span>
            </TableHead>
            <TableHead className='p-2'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData2.map((el) => (
            <TableRow
              key={el.iso2}
              className={cn(
                'cursor-pointer',
                selectedCountry === el.name!
                  ? ' bg-green-500/20 text-accent-foreground'
                  : '',
                el.name!.toLowerCase() === 'antarctica' && 'hidden'
              )}
              onClick={() => {
                setSelectedCountry(el);
                setSelectedCountryCode(el);
              }}
            >
              <TableCell className='p-2'>{el.name}</TableCell>
              <TableCell className='p-2 flex gap-2 items-center'>
                {selectedCountry === el.name! ? (
                  <CheckCheck className='size-4' />
                ) : (
                  <Check className='size-4' />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
