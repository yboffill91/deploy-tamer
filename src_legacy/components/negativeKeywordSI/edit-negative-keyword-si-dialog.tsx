"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";
import { useUpdateNegativeKeywordSI } from "@/hooks/key_research/use-negative-keywords-si";

export default function EditNegativeKeywordSIDialog() {
  const [editedName, setEditedName] = useState("");
  const [editedIntent, setEditedIntent] = useState("transactional");

  const { showEditDialog, setShowEditDialog, editingKeyword } = useNegativeKeywordSIStore();
  const { mutate: updateKeyword, isPending } = useUpdateNegativeKeywordSI();

  useEffect(() => {
    if (editingKeyword) {
      setEditedName(editingKeyword.negative_keyword_by_si_word);
      setEditedIntent(editingKeyword.negative_keyword_by_si_intent);
    }
  }, [editingKeyword]);

  const handleUpdateKeyword = () => {
    if (!editingKeyword || !editedName.trim()) return;

    updateKeyword(
      {
        negative_keyword_by_si_id: editingKeyword.negative_keyword_by_si_id,
        negative_keyword_by_si_word: editedName,
        negative_keyword_by_si_intent: editedIntent,
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
          <DialogTitle className="text-lg">Edit Negative Keyword</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Input
              placeholder="Enter negative keyword"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-9"
            />
            <div className="mt-4 space-y-2">
              <Label htmlFor="edit-intent">Search Intent</Label>
              <select
                id="edit-intent"
                value={editedIntent}
                onChange={(e) => setEditedIntent(e.target.value)}
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="transactional">Transactional</option>
                <option value="informational">Informational</option>
              </select>
            </div>
          </div>
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={handleUpdateKeyword}
            disabled={isPending || !editedName.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Keyword"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
