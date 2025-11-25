'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Eye,
  ArrowUpDown,
  FilterX,
  Search,
  ArrowRightCircle,
  Check,
  CheckCheck,
} from 'lucide-react';
import { CountriesEntity } from '@/core/entities';
import {
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
export function CountriesDataTable({
  data,
  onIso2Select,
  onNameSelect,
  showView = true,
  showNextStep = true,
  showSelect = false,
}: {
  data: CountriesEntity[];
  onIso2Select?: (iso2: string) => void;
  onNameSelect?: (name: CountriesEntity) => void;
  showView?: boolean;
  showNextStep?: boolean;
  showSelect?: boolean;
}) {
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] =
    useState<CountriesEntity | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<CountriesEntity>();
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
                <ArrowUpDown className='w-4 h-4' />
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
                '',
                selectedCountries === el
                  ? ' bg-green-300/10 text-accent-foreground'
                  : ''
              )}
            >
              <TableCell className='p-2'>{el.name}</TableCell>
              <TableCell className='p-2 flex gap-2 items-center'>
                {showView && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setSelectedCountry(el)}
                      >
                        <Eye />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Country Info</DialogTitle>
                      </DialogHeader>
                      {selectedCountry ? (
                        <div className='space-y-2 max-h-[70vh] overflow-y-auto'>
                          {Object.entries(selectedCountry).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className={cn(
                                  'border-b py-2',
                                  value === undefined ||
                                    !value ||
                                    (value.isArray && value.length === 0)
                                    ? 'hidden'
                                    : 'block',
                                  key === 'id' && 'hidden'
                                )}
                              >
                                <span className='font-medium capitalize'>
                                  {key}
                                </span>
                                <div className='mt-1 text-sm text-muted-foreground'>
                                  {typeof value === 'object' ? (
                                    <pre className='bg-secondary p-2 rounded-md overflow-x-auto text-xs whitespace-pre-wrap'>
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  ) : key === 'createdAt' ||
                                    key === 'updatedAt' ||
                                    key === 'deletedAt' ? (
                                    <span>{value}</span>
                                  ) : (
                                    <span>{String(value)}</span>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p>No data</p>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {showNextStep && onIso2Select && (
                  <Button
                    size='icon'
                    variant={'outline'}
                    onClick={() => {
                      onIso2Select(el.iso2!);
                    }}
                  >
                    <ArrowRightCircle />
                  </Button>
                )}
                {showSelect && onNameSelect && (
                  <Button
                    type='button'
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {
                      setSelectedCountries(el);
                      onNameSelect(el);
                    }}
                  >
                    {selectedCountries === el ? (
                      <CheckCheck className='dark:text-green-400 text-green-700 rounded bg-green-400/20' />
                    ) : (
                      <Check />
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
