"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
  NegativeKeywordSITable,
  NegativeKeywordSISearch,
  NegativeKeywordSIFilter,
  AddNegativeKeywordSIDialog,
  EditNegativeKeywordSIDialog,
  NegativeKeywordSIPagination,
} from "@/components/negativeKeywordSI/";
import { useNegativeKeywordsSI } from "@/hooks/key_research/use-negative-keywords-si";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";

export default function NegativeKeywordSIPage() {
  const { setShowAddDialog } = useNegativeKeywordSIStore();

  // Fetch negative keywords
  useNegativeKeywordsSI();

  return (
    <div className="mx-auto mt-8 max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Negative Keywords SI</h1>
        <div className="flex items-center gap-4">
          <NegativeKeywordSISearch />
          <NegativeKeywordSIFilter />
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Negative Keyword
          </Button>
        </div>
      </div>

      <AddNegativeKeywordSIDialog />
      <EditNegativeKeywordSIDialog />

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <NegativeKeywordSITable />
          </TableBody>
        </Table>

        <div className="mt-4 h-4 border-t"></div>
        <NegativeKeywordSIPagination />
      </Card>
    </div>
  );
}
