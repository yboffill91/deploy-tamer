"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateCompany } from "@/hooks/key_research/use-companies";
import { useCompanyStore } from "@/stores/key_research/company-store";

export function EditCompanyDialog() {
  const [editedName, setEditedName] = useState("");
  const { showEditDialog, setShowEditDialog, editingCompany } = useCompanyStore();
  const { mutate: updateCompany, isPending } = useUpdateCompany();

  useEffect(() => {
    if (editingCompany) {
      setEditedName(editingCompany.name);
    }
  }, [editingCompany]);

  const handleUpdateCompany = () => {
    if (!editingCompany || !editedName.trim()) return;

    updateCompany(
      {
        id: editingCompany.id,
        name: editedName,
      },
      {
        onSuccess: () => {
          setShowEditDialog(false);
        },
      },
    );
  };

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Input
              placeholder="Enter company name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-9"
            />
          </div>
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={handleUpdateCompany}
            disabled={isPending || !editedName.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Company"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
