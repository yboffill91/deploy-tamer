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
} from '@/components/ui';

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

import { useState } from 'react';

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
    pageSize: 20,
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
    <Card className='overflow-hidden rounded-xl shadow-md border bg-card py-0!'>
      {/* HEADER / FILTER TOOLBAR */}
      <CardHeader className='p-3 border-b bg-muted/20'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
          {/* LEFT SIDE ACTIONS */}
          <div className='flex items-center gap-2 w-full md:w-auto'>
            <InputGroup>
              <InputGroupInput
                placeholder='Filter data'
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className='rounded-md'
              />

              <InputGroupAddon>
                <Search className='size-4' />
              </InputGroupAddon>

              <InputGroupButton
                onClick={() => setFiltering('')}
                disabled={!filtering.length}
              >
                <FilterX className='size-4' />
              </InputGroupButton>
            </InputGroup>
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className='flex items-center gap-2'>
            {/* ROW SIZE SELECT */}
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
                <SelectTrigger className='w-[90px] h-9' size='sm'>
                  <SelectValue defaultValue={pagination.pageSize} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                  <SelectItem value='100'>100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* COLUMN VISIBILITY */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' variant='outline' className='gap-1'>
                  <SlidersHorizontal className='size-4' />
                  Columns
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-40'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      className='capitalize'
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ADD BUTTON */}
            {onAdd && (
              <Button onClick={onAdd} size='sm' className='gap-1'>
                <Plus className='size-4' />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* TABLE */}
      <CardContent className=''>
        <Table className='rounded-xl overflow-hidden border-separate border-spacing-0 border'>
          <TableHeader className='bg-muted text-muted-foreground '>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className='cursor-pointer select-none py-3 font-semibold text-sm border-b'
                  >
                    <div className='flex items-center gap-1'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {header.column.getIsSorted() === 'asc' && (
                        <ChevronUp className='size-4 opacity-70' />
                      )}

                      {header.column.getIsSorted() === 'desc' && (
                        <ChevronDown className='size-4 opacity-70' />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='hover:bg-muted/30 transition-colors duration-100 ease-out '
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='py-3 border-b border-muted/30'
                    >
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
                  className='text-center py-6 text-muted-foreground'
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* FOOTER / PAGINATION */}
      <CardFooter className='flex items-center justify-between py-3 border-t bg-muted/20'>
        <Badge variant='secondary'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </Badge>

        {(table.getCanNextPage() || table.getCanPreviousPage()) && (
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
        )}
      </CardFooter>
    </Card>
  );
}
