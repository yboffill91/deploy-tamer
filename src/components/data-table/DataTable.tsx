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

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

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
  Checkbox,
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
  GripVertical,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

/* ---------------------------------------------------
   Sortable column item
--------------------------------------------------- */

function SortableColumnItem({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange(value: boolean): void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-1 rounded ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-move hover:bg-muted'
      }`}
    >
      <GripVertical
        {...attributes}
        {...listeners}
        className='size-4 text-muted-foreground'
      />
      <DropdownMenuCheckboxItem
        checked={checked}
        onCheckedChange={onCheckedChange}
        onSelect={(e) => e.preventDefault()}
        className='capitalize w-full'
        disabled={disabled}
      >
        {label}
      </DropdownMenuCheckboxItem>
    </div>
  );
}

/* ---------------------------------------------------
   DataTable
--------------------------------------------------- */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAdd?(): void;
  pageSize?: number;
  enableSelection?: boolean;
  persistKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
  enableSelection = false,
  pageSize = 20,
  persistKey,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const [columnVisibility, setColumnVisibility] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sorting, setSorting] = useState<any[]>([]);
  const [filtering, setFiltering] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [pageSizeValue, setPageSizeValue] = useState<string>(String(pageSize));

  /* ---------- selection column ---------- */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectionColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const finalColumns = useMemo(() => {
    return enableSelection ? [selectionColumn, ...columns] : columns;
  }, [enableSelection, selectionColumn, columns]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      pagination,
      columnVisibility,
      sorting,
      globalFilter: filtering,
      rowSelection,
      columnOrder,
    },

    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,

    enableRowSelection: enableSelection,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  /* ---------- INIT column order from TABLE ---------- */
  useEffect(() => {
    if (columnOrder.length > 0) return;

    const ids = table.getAllLeafColumns().map((c) => c.id);
    setColumnOrder(ids);
  }, [table, columnOrder.length]);

  /* ---------- hydrate persisted order ---------- */
  useEffect(() => {
    if (!persistKey) return;

    const stored = localStorage.getItem(persistKey);
    if (!stored) return;

    const storedIds: string[] = JSON.parse(stored);
    const currentIds = table.getAllLeafColumns().map((c) => c.id);

    const next = storedIds.filter((id) => currentIds.includes(id));

    currentIds.forEach((id) => {
      if (!next.includes(id)) next.push(id);
    });

    setColumnOrder(next);
  }, [table, persistKey]);

  /* ---------- persist order ---------- */
  useEffect(() => {
    if (!persistKey || columnOrder.length === 0) return;
    localStorage.setItem(persistKey, JSON.stringify(columnOrder));
  }, [columnOrder, persistKey]);

  /* ---------- DND ---------- */
  const draggableIds = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide())
    .map((c) => c.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  };

  const totalRows = table.getFilteredRowModel().rows.length;
  useEffect(() => {
    if (pageSizeValue === 'All') {
      table.setPageSize(totalRows);
    }
  }, [totalRows, pageSizeValue, table]);

  return (
    <Card className='rounded-xl border bg-card'>
      <CardHeader className='p-3 border-b bg-muted/20'>
        <div className='flex justify-between gap-3'>
          <InputGroup>
            <InputGroupInput
              placeholder='Filter data'
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
            />
            <InputGroupAddon>
              <Search className='size-4' />
            </InputGroupAddon>
            <InputGroupButton
              onClick={() => setFiltering('')}
              disabled={!filtering}
            >
              <FilterX className='size-4' />
            </InputGroupButton>
          </InputGroup>

          <div className='flex gap-2 items-center'>
            <Select
              value={pageSizeValue}
              onValueChange={(v) => {
                setPageSizeValue(v);

                if (v === 'All') {
                  table.setPageSize(totalRows);
                } else {
                  table.setPageSize(Number(v));
                }
              }}
            >
              <SelectTrigger className='w-[90px] h-9'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['5', '10', '20', '50', '100', 'All'].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <SlidersHorizontal className='size-4' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-64'>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={draggableIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table
                      .getAllLeafColumns()
                      .filter((c) => c.getCanHide())
                      .map((column) => (
                        <SortableColumnItem
                          key={column.id}
                          id={column.id}
                          label={column.id}
                          checked={column.getIsVisible()}
                          onCheckedChange={(v) => column.toggleVisibility(!!v)}
                        />
                      ))}
                  </SortableContext>
                </DndContext>
              </DropdownMenuContent>
            </DropdownMenu>

            {onAdd && (
              <Button onClick={onAdd} size='sm'>
                <Plus className='size-4' />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className='cursor-pointer'
                  >
                    <div className='flex items-center gap-1'>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === 'asc' && (
                        <ChevronUp className='size-4' />
                      )}
                      {h.column.getIsSorted() === 'desc' && (
                        <ChevronDown className='size-4' />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className='flex justify-between border-t bg-muted/20'>
        <Badge variant='secondary'>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </Badge>

        <div className='flex gap-1'>
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
      </CardFooter>
    </Card>
  );
}
