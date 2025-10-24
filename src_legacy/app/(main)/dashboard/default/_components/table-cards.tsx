"use client";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { recentLeadsData } from "./crm.config";
import { recentLeadsColumns } from "./columns.crm";
import { useCustomerStore } from "@/stores/use-customer-store";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel } from "@/utils/export-to-excel";

export function TableCards() {
  const { recentLeads } = useCustomerStore();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const table = useDataTableInstance({
    data: recentLeads,
    columns: recentLeadsColumns,
    getRowId: (row) => row.id.toString(),
  });

  useEffect(() => {
    if (recentLeads) {
      setShowSkeleton(false);
    }
  }, [recentLeads]);

  const handleExport = () => {
    exportToExcel(recentLeads, "recent_leads.xlsx", "Recent Leads");
  };

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <CardAction>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="flex size-full flex-col gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Track and manage your latest leads and their status.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={recentLeadsColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
