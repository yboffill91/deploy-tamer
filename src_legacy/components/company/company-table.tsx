"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useCompanyStore } from "@/stores/key_research/company-store";
import { useDeleteCompany } from "@/hooks/key_research/use-companies";

const ITEMS_PER_PAGE = 15;

export function CompanyTable() {
  const { companies, searchQuery, currentPage, setEditingCompany, setShowEditDialog } = useCompanyStore();
  const { mutate: deleteCompany } = useDeleteCompany();

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  console.log("compañias: ", companies, "filtrado: ", filteredCompanies);

  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleEditClick = (company: any) => {
    setEditingCompany(company);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (companyId: number) => {
    deleteCompany(companyId);
  };

  if (companies.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={3} className="text-muted-foreground h-32 text-center">
          No companies found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {paginatedCompanies.map((company, index) => (
        <TableRow key={company.id}>
          <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
          <TableCell>{company.name}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditClick(company)}
                className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteClick(company.id)}
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
