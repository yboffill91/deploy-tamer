"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateCompany } from "@/hooks/key_research/use-companies";
import { useCompanyStore } from "@/stores/key_research/company-store";

export function AddCompanyDialog() {
  const [newCompanies, setNewCompanies] = useState("");
  const { showAddDialog, setShowAddDialog } = useCompanyStore();
  const { mutate: createCompany, isPending } = useCreateCompany();

  const handleAddCompanies = () => {
    if (!newCompanies.trim()) return;

    const companyNames = newCompanies
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    companyNames.forEach((name) => {
      createCompany({ name });
    });

    setNewCompanies("");
    setShowAddDialog(false);
  };

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Companies</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Input
              placeholder="Enter company names separated by commas"
              value={newCompanies}
              onChange={(e) => setNewCompanies(e.target.value)}
              className="h-9"
            />
            <p className="text-muted-foreground text-xs">Example: Microsoft, Apple, Google</p>
          </div>
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={handleAddCompanies}
            disabled={isPending || !newCompanies.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Companies"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
