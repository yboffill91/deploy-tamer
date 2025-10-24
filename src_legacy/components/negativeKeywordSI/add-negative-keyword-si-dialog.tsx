"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNegativeKeywordSIStore } from "@/stores/key_research/negative-keyword-si-store";
import { useCreateNegativeKeywordSI } from "@/hooks/key_research/use-negative-keywords-si";

export default function AddNegativeKeywordSIDialog() {
  const [newKeywords, setNewKeywords] = useState("");
  const [newKeywordIntent, setNewKeywordIntent] = useState("transactional");

  const { showAddDialog, setShowAddDialog } = useNegativeKeywordSIStore();
  const { mutate: createKeyword, isPending } = useCreateNegativeKeywordSI();

  const handleAddKeywords = () => {
    if (!newKeywords.trim()) return;

    const keywordNames = newKeywords
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    keywordNames.forEach((name) => {
      createKeyword({
        negative_keyword_by_si_word: name,
        negative_keyword_by_si_intent: newKeywordIntent,
      });
    });

    setNewKeywords("");
    setShowAddDialog(false);
  };

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Negative Keywords</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Input
              placeholder="Enter negative keywords separated by commas"
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              className="h-9"
            />
            <div className="mt-4 space-y-2">
              <Label htmlFor="intent">Search Intent</Label>
              <select
                id="intent"
                value={newKeywordIntent}
                onChange={(e) => setNewKeywordIntent(e.target.value)}
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="transactional">Transactional</option>
                <option value="informational">Informational</option>
              </select>
            </div>
            <p className="text-muted-foreground text-xs">Example: free, download, torrent</p>
          </div>
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={handleAddKeywords}
            disabled={isPending || !newKeywords.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Keywords"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
