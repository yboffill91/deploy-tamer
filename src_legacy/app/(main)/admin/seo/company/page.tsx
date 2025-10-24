"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useCompanies } from "@/hooks/key_research/use-companies";
import { useCompanyStore } from "@/stores/key_research/company-store";
import { CompanyTable } from "@/components/company/company-table";
import { CompanySearch } from "@/components/company/company-search";
import { AddCompanyDialog } from "@/components/company/add-company-dialog";
import { EditCompanyDialog } from "@/components/company/edit-company-dialog";
import { Pagination } from "@/components/company/pagination";

export default function CompanyListPage() {
  const { isLoading } = useCompanies();
  const { setShowAddDialog } = useCompanyStore();

  return (
    <div className="mx-auto mt-8 max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company List</h1>
        <div className="flex items-center gap-4">
          <CompanySearch />
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <AddCompanyDialog />
      <EditCompanyDialog />

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground h-32 text-center">
                  Loading companies...
                </TableCell>
              </TableRow>
            ) : (
              <CompanyTable />
            )}
          </TableBody>
        </Table>

        <div className="mt-4 h-4 border-t"></div>
        <Pagination />
      </Card>
    </div>
  );
}
