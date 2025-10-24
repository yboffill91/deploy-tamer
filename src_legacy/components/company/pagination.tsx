"use client";

import { Button } from "@/components/ui/button";
import { useCompanyStore } from "@/stores/key_research/company-store";

export function Pagination() {
  const { companies, searchQuery, currentPage, setCurrentPage } = useCompanyStore();

  const ITEMS_PER_PAGE = 15;
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-2 flex items-center justify-center space-x-2">
      <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
