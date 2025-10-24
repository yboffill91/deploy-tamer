"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";

export default function NegativeKeywordSISearch() {
  const { searchQuery, setSearchQuery } = useNegativeKeywordSIStore();

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder="Search negative keywords..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[250px] pl-9"
      />
    </div>
  );
}
