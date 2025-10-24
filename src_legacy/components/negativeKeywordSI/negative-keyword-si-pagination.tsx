"use client";

import { Button } from "@/components/ui/button";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";

const ITEMS_PER_PAGE = 15;

export default function NegativeKeywordSIPagination() {
  const { negativeKeywords, searchQuery, intentFilter, currentPage, setCurrentPage } = useNegativeKeywordSIStore();

  const filteredKeywords = negativeKeywords.filter(
    (keyword) =>
      keyword.negative_keyword_by_si_word.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (intentFilter === "all" || keyword.negative_keyword_by_si_intent?.toLowerCase() === intentFilter.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredKeywords.length / ITEMS_PER_PAGE);

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
