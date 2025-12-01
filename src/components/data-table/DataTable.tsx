'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FilterX,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAdd?(): void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sortColumn, setSortColumn] = useState([]);
  const [filtering, setFiltering] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnVisibility,
      sorting: sortColumn,
      globalFilter: filtering,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSortColumn,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltering,
  });

  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <Card className='overflow-hidden rounded-md border'>
      <CardHeader>
        <div className='w-full flex md:items-center items-end gap-2 justify-between md:flex-row flex-col-reverse'>
          <div className='flex items-center gap-2'>
            <InputGroup>
              <InputGroupInput
                placeholder='Filter Data'
                onChange={(e) => setFiltering(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupButton
                onClick={() => setFiltering('')}
                disabled={filtering.length === 0}
                className={filtering.length === 0 && 'hidden'}
              >
                <FilterX />
              </InputGroupButton>
            </InputGroup>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Rows:</span>

            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => {
                if (value === 'all') {
                  table.setPageSize(totalRows);
                } else {
                  table.setPageSize(Number(value));
                }
              }}
            >
              <SelectTrigger className='w-[90px]' size='sm'>
                <SelectValue placeholder='10' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='5'>5</SelectItem>

                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>

                <SelectItem value='all'>All</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='ml-auto'>
                  <SlidersHorizontal className='mr-2 h-4 w-4' />
                  Columnas
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {onAdd && (
              <Button onClick={onAdd} size='sm'>
                <Plus />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table className='border'>
          <TableHeader className='bg-accent text-accent-foreground'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='cursor-pointer '
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Button className='w-full justify-start' variant='ghost'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() === 'asc' && (
                        <ChevronUp className='size-4' />
                      )}

                      {header.column.getIsSorted() === 'desc' && (
                        <ChevronDown className='size-4' />
                      )}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <Badge variant='secondary'>
          {table.getState().pagination.pageIndex + 1} - {table.getPageCount()}
        </Badge>
        <div className='flex items-center gap-1'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst />
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='border px-3 py-2 rounded disabled:opacity-50'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLast />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
