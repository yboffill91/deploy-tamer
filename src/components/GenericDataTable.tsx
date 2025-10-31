/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import {
  ChevronDown,
  ArrowUpDown,
  Edit,
  Trash2,
  ChevronsUpDown,
  Check,
  Plus,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from './ui';

interface GenericDataTableProps<TData extends Record<string, any>> {
  data: TData[];
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  onAdd?: (searchValue: string) => void;
  showAddButton?: boolean;
  excludeColumns?: string[];
  customRenderers?: Record<
    string,
    (value: any, item: TData) => React.ReactNode
  >;
}

export function GenericDataTable<TData extends Record<string, any>>({
  data,
  onEdit,
  onDelete,
  onAdd,
  showAddButton = true,
  excludeColumns = [],
  customRenderers = {},
}: GenericDataTableProps<TData>) {
  const columns = React.useMemo(() => {
    if (data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter(
      (key) => !excludeColumns.includes(key)
    );
  }, [data, excludeColumns]);

  const filterColumn = React.useMemo(() => {
    return columns.find((col) => col !== 'id') || columns[0];
  }, [columns]);

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  );

  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((col) => {
      initial[col] = col !== 'id'; // Hide 'id' column by default
    });
    return initial;
  });

  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState<number | 'all'>(20);

  const filteredData = React.useMemo(() => {
    if (!globalFilter || !filterColumn) return data;

    return data.filter((item) => {
      const value = item[filterColumn];
      if (value == null) return false;
      return String(value).toLowerCase().includes(globalFilter.toLowerCase());
    });
  }, [data, globalFilter, filterColumn]);

  // const hasNoResults = globalFilter && filteredData.length === 0;

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const comparison = aValue.length - bValue.length;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'object' && typeof bValue === 'object') {
        const aStr = JSON.stringify(aValue);
        const bStr = JSON.stringify(bValue);
        const comparison = aStr.localeCompare(bStr);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = React.useMemo(() => {
    if (pageSize === 'all') return sortedData;
    const start = currentPage * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages =
    pageSize === 'all' ? 1 : Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const visibleColumns = columns.filter((col) => columnVisibility[col]);

  const renderCellValue = (column: string, value: any, item: TData) => {
    if (customRenderers[column]) {
      return customRenderers[column](value, item);
    }

    if (value == null) {
      return <span className='text-muted-foreground italic'>-</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className='text-muted-foreground italic'>Empty</span>;
      }
      return (
        <div className='flex flex-wrap gap-1'>
          {value.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className='rounded bg-secondary px-2 py-0.5 text-xs'
            >
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </span>
          ))}
          {value.length > 3 && (
            <span className='text-xs text-muted-foreground'>
              +{value.length - 3} more
            </span>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <span className='rounded bg-secondary px-2 py-0.5 text-xs font-mono'>
          {JSON.stringify(value).slice(0, 50)}
          {JSON.stringify(value).length > 50 ? '...' : ''}
        </span>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    if (typeof value === 'number') {
      return <span className='font-medium'>{value.toLocaleString()}</span>;
    }

    return <span className='text-sm'>{String(value)}</span>;
  };

  const formatColumnHeader = (column: string) => {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getItemDisplayText = (item: TData) => {
    if (!filterColumn) return '';
    const value = item[filterColumn];
    if (value == null) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center gap-4'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[300px] justify-between bg-transparent'
            >
              {globalFilter
                ? `Filtering: ${globalFilter}`
                : `Search by ${formatColumnHeader(filterColumn)}...`}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[300px] p-0'>
            <Command>
              <CommandInput
                placeholder={`Search by ${formatColumnHeader(filterColumn)}...`}
                value={globalFilter}
                onValueChange={(value) => {
                  setGlobalFilter(value);
                  setCurrentPage(0);
                }}
              />
              <CommandList>
                <CommandEmpty>
                  <Badge variant={'destructive'}>
                    <AlertCircle className='size-4' /> No results for{' '}
                    {globalFilter}
                  </Badge>
                </CommandEmpty>
                <CommandGroup>
                  {filteredData.slice(0, 50).map((item, index) => (
                    <CommandItem
                      key={item.id || index}
                      value={getItemDisplayText(item)}
                      onSelect={() => {
                        setGlobalFilter(getItemDisplayText(item));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          globalFilter === getItemDisplayText(item)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {getItemDisplayText(item)}
                    </CommandItem>
                  ))}
                  {filteredData.length > 50 && (
                    <div className='px-2 py-1.5 text-xs text-muted-foreground'>
                      Showing first 50 results. Type to refine search.
                    </div>
                  )}
                </CommandGroup>
                {showAddButton && onAdd && globalFilter && (
                  <div className='border-t p-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        onAdd(globalFilter);
                        setOpen(false);
                      }}
                      className='w-full justify-start gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Add new record{' '}
                      {filteredData.length <= 0 && (
                        <Badge>{globalFilter} </Badge>
                      )}{' '}
                    </Button>
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto bg-transparent'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='max-h-[300px] overflow-y-auto'
          >
            {columns
              .filter((col) => col !== 'id')
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className='capitalize'
                    checked={columnVisibility[column]}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column]: !!value,
                      }))
                    }
                  >
                    {formatColumnHeader(column)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column}>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort(column)}
                    className='-ml-4 h-8 data-[state=open]:bg-accent'
                  >
                    {formatColumnHeader(column)}
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
              ))}
              {(onEdit || onDelete) && onAdd && showAddButton && (
                <TableHead className='text-right'>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column}>
                      {renderCellValue(column, item[column], item)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && onAdd && showAddButton && (
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        {onEdit && (
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onEdit(item)}
                            className='h-8 w-8'
                          >
                            <Edit className='h-4 w-4' />
                            <span className='sr-only'>Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={async () => onDelete(item)}
                            className='h-8 w-8 text-destructive bg-destructive/10 hover:text-destructive'
                          >
                            <Trash2 className='h-4 w-4' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (onEdit || onDelete ? 1 : 0)}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <p className='text-sm text-muted-foreground'>Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(value === 'all' ? 'all' : Number(value));
              setCurrentPage(0);
            }}
          >
            <SelectTrigger className='h-8 w-[100px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
              <SelectItem value='all'>All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-muted-foreground'>
            {pageSize === 'all'
              ? `Showing all ${sortedData.length} row(s)`
              : `Showing ${currentPage * (pageSize as number) + 1}-${Math.min(
                  (currentPage + 1) * (pageSize as number),
                  sortedData.length
                )} of ${sortedData.length} row(s)`}
          </div>
          {pageSize !== 'all' && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground'>
                Page {currentPage + 1} of {totalPages || 1}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
