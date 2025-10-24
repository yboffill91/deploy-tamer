"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCompanyStore } from "@/stores/key_research/company-store";

export function CompanySearch() {
  const { searchQuery, setSearchQuery } = useCompanyStore();

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder="Search companies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[250px] pl-9"
      />
    </div>
  );
}
