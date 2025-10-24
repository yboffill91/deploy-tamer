"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns,
  Plus,
  Search,
  Check,
  Filter,
  X,
} from "lucide-react";

import { customerColumns } from "./customer-columns";
import { DrawerProvider } from "./customer-drawer";
import { SAMPLE_CUSTOMERS_DATA } from "@/data/customers";
import { useCustomersEnhanced } from "@/hooks/use-customers-enhanced";
import { toast } from "sonner";
import { Customer } from "@/lib/api/types";

// Simple components
function Input({
  className = "",
  placeholder,
  value,
  onChange,
  ...props
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}) {
  return (
    <input
      className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

function Label({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
}

function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | "sm";
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
    sm: "h-9 rounded-md px-3",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Dropdown Filter Component (like customize columns)
function DropdownFilter({
  value,
  onValueChange,
  options,
  label,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-filter")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`dropdown-filter relative ${className}`}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="">
        <span className="text-xs">
          {label}: {selectedOption?.label}
        </span>
        <ChevronDown size={16} />
      </Button>

      {isOpen && (
        <div className="bg-muted absolute top-full right-0 z-[500] mt-1 w-40 rounded-md border p-1 shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="hover:bg-muted-foreground relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none"
              onClick={(e) => {
                e.stopPropagation();
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {value === option.value && <Check size={12} />}
              </span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple Select for pagination
function PaginationSelect({
  value,
  onValueChange,
  options,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: number[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`h-8 w-[70px] rounded-md border focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    >
      {options.map((option) => (
        <option key={option} value={option.toString()}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Table components
function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
    </div>
  );
}

function TableHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;
}

function TableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
}

function TableRow({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <tr className={`border-b ${className}`} {...props}>
      {children}
    </tr>
  );
}

function TableHead({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <th className={`h-12 px-4 align-middle font-medium [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </th>
  );
}

function TableCell({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  );
}

// Simple Table Row component
function TableRowComponent({ row }: { row: Row<Customer> }) {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell className="text-center" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Main CustomerTable component
export function CustomerTable() {
  const { data, loading, error } = useCustomersEnhanced();
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [showColumnCustomizer, setShowColumnCustomizer] = React.useState(false);
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = React.useState<string>("all");

  const sortableId = React.useId();

  // Close dropdown when clicking outside
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.customers.filter((customer) => {
      const matchesPlan = planFilter === "all" || customer.plan === planFilter;
      const matchesStatus = statusFilter === "all" || customer.planStatus === statusFilter;
      const matchesDelivery = deliveryFilter === "all" || customer.deliveryStatus === deliveryFilter;

      return matchesPlan && matchesStatus && matchesDelivery;
    });
  }, [data, planFilter, statusFilter, deliveryFilter]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".column-customizer")) {
        setShowColumnCustomizer(false);
      }
    }

    if (showColumnCustomizer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColumnCustomizer]);

  const table = useReactTable({
    data: filteredData,
    columns: customerColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row._id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  });

  // Reset filters function
  const resetFilters = () => {
    setPlanFilter("all");
    setStatusFilter("all");
    setDeliveryFilter("all");
    setGlobalFilter("");
  };

  // Manejar estados de loading y error
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return toast.error("alabao");
  }

  // Si no hay datos después de cargar
  if (!data || data.customers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">No customers found</div>
      </div>
    );
  }

  return (
    <DrawerProvider>
      <div className="w-full space-y-4">
        {/* Header with search and filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="bg-muted w-80 border-gray-700 pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              {/* Plan Filter */}
              <DropdownFilter
                value={planFilter}
                onValueChange={setPlanFilter}
                label="Plan"
                options={[
                  { value: "all", label: "All" },
                  { value: "lite", label: "Lite" },
                  { value: "pro", label: "Pro" },
                  { value: "max", label: "Max" },
                ]}
              />

              {/* Status Filter */}
              <DropdownFilter
                value={statusFilter}
                onValueChange={setStatusFilter}
                label="Status"
                options={[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "trial", label: "Trial" },
                  { value: "expired", label: "Expired" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />

              {/* Delivery Filter */}
              <DropdownFilter
                value={deliveryFilter}
                onValueChange={setDeliveryFilter}
                label="Delivery"
                options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                  { value: "failed", label: "Failed" },
                ]}
              />

              {/* Clear Filters Button */}
              {(planFilter !== "all" || statusFilter !== "all" || deliveryFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2 text-xs text-gray-400 hover:text-white"
                >
                  <X size={14} className="mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Customize Columns Dropdown */}
            <div className="column-customizer relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColumnCustomizer(!showColumnCustomizer)}
                className="bg-muted"
              >
                <Columns size={16} />
                <span className="ml-2 hidden lg:inline">Customize Columns</span>
                <ChevronDown size={16} />
              </Button>

              {showColumnCustomizer && (
                <div className="bg-muted absolute top-full right-0 z-[500] mt-1 w-56 rounded-md border p-1 shadow-lg">
                  {table
                    .getAllColumns()
                    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                    .map((column) => {
                      return (
                        <div
                          key={column.id}
                          className="hover:bg-muted-foreground relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            column.toggleVisibility(!column.getIsVisible());
                          }}
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            {column.getIsVisible() && <Check size={12} />}
                          </span>
                          <span className="capitalize">{column.id}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredData.length} of {data.customers.length} customers
            {(planFilter !== "all" || statusFilter !== "all" || deliveryFilter !== "all") && " (filtered)"}
          </span>
        </div>

        {/* Table */}
        <div className="grid grid-cols-1 gap-4 rounded-md border *:data-[slot=card]:shadow-xs">
          <Table className="bg-card rounded-md">
            <TableHeader className="rounded-t-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="rounded-t-md">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan} className="text-start">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => <TableRowComponent key={row.id} row={row} />)
              ) : (
                <TableRow className="**:data-[slot=table-cell]:first:w-8">
                  <TableCell colSpan={customerColumns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-gray-400">
            Showing {table.getFilteredRowModel().rows.length} customers
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Rows per page</Label>
              <PaginationSelect
                value={`${table.getState().pagination.pageSize}`}
                className="bg-muted"
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                options={[10, 20, 30, 40, 50]}
              />
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-muted-foreground/10 hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="bg-muted-foreground/10 h-8 w-8 p-0"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="bg-muted-foreground/10 h-8 w-8 p-0"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-muted-foreground/10 hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DrawerProvider>
  );
}
