"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";
import { useDeleteNegativeKeywordSI } from "@/hooks/key_research/use-negative-keywords-si";

const ITEMS_PER_PAGE = 15;

export default function NegativeKeywordSITable() {
  const { negativeKeywords, isLoading, searchQuery, intentFilter, currentPage, setEditingKeyword, setShowEditDialog } =
    useNegativeKeywordSIStore();
  const { mutate: deleteKeyword } = useDeleteNegativeKeywordSI();

  const filteredKeywords = negativeKeywords.filter(
    (keyword) =>
      keyword.negative_keyword_by_si_word.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (intentFilter === "all" || keyword.negative_keyword_by_si_intent?.toLowerCase() === intentFilter.toLowerCase()),
  );

  const paginatedKeywords = filteredKeywords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleEditClick = (keyword: any) => {
    setEditingKeyword(keyword);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (keywordId: number) => {
    deleteKeyword(keywordId);
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-muted-foreground h-32 text-center">
          Loading negative keywords...
        </TableCell>
      </TableRow>
    );
  }

  if (negativeKeywords.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-muted-foreground h-32 text-center">
          No negative keywords found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {paginatedKeywords.map((keyword, index) => (
        <TableRow key={keyword.negative_keyword_by_si_id}>
          <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
          <TableCell>{keyword.negative_keyword_by_si_word}</TableCell>
          <TableCell>
            {keyword.negative_keyword_by_si_intent?.charAt(0).toUpperCase() +
              keyword.negative_keyword_by_si_intent?.slice(1) || "Unknown"}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditClick(keyword)}
                className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteClick(keyword.negative_keyword_by_si_id)}
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
