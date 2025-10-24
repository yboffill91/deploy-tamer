"use client";

import { CityTable } from "@/components/city/city-table";
import { CityAddDialog } from "@/components/city/city-add-dialog";
import { CitySearchBar } from "@/components/city/city-search-bar";
import { useCityStore } from "@/stores/key_research/city-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CityListPage() {
  const { setShowAddDialog } = useCityStore();

  return (
    <div className="mx-auto mt-8 max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">City List</h1>
        <div className="flex items-center gap-4">
          <CitySearchBar />
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </div>
      </div>

      <CityTable />
      <CityAddDialog />
    </div>
  );
}
