"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

interface SuggestionsDialogProps {
  type: "target" | "negative";
}

export const SuggestionsDialog = ({ type }: SuggestionsDialogProps) => {
  const {
    targetSuggestions,
    negativeSuggestions,
    selectedTargetSuggestions,
    selectedNegativeSuggestions,
    showTargetSuggestions,
    showNegativeSuggestions,
    toggleTargetSuggestion,
    toggleNegativeSuggestion,
    addSelectedTargetSuggestions,
    addSelectedNegativeSuggestions,
    setShowTargetSuggestions,
    setShowNegativeSuggestions,
  } = useKeywordResearchStore();

  const suggestions = type === "target" ? targetSuggestions : negativeSuggestions;
  const selectedSuggestions = type === "target" ? selectedTargetSuggestions : selectedNegativeSuggestions;
  const showSuggestions = type === "target" ? showTargetSuggestions : showNegativeSuggestions;

  const toggleSuggestion = type === "target" ? toggleTargetSuggestion : toggleNegativeSuggestion;
  const addSelectedSuggestions = type === "target" ? addSelectedTargetSuggestions : addSelectedNegativeSuggestions;
  const setShowSuggestions = type === "target" ? setShowTargetSuggestions : setShowNegativeSuggestions;

  const title = type === "target" ? "AI Suggested Keywords" : "AI Suggested Negative Keywords";

  return (
    <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
      <DialogContent className="grid max-h-[90vh] w-[95vw] grid-rows-[auto,1fr,auto] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            Select the keywords you want to add to your {type === "target" ? "target" : "negative"} list
          </p>
        </DialogHeader>
        <div className="flex max-h-[500px] min-h-[300px] flex-col overflow-hidden">
          <div className="grid flex-1 grid-cols-1 gap-2 overflow-y-auto rounded-md border p-4 sm:grid-cols-2">
            {suggestions.map((word, index) => (
              <div
                key={`${type}-suggestion-${index}`}
                className="hover:bg-accent flex items-center space-x-2 rounded-md p-2 transition-colors"
              >
                <Checkbox
                  id={`${type}-suggestion-${index}`}
                  checked={selectedSuggestions.includes(word)}
                  onCheckedChange={() => toggleSuggestion(word)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor={`${type}-suggestion-${index}`} className="flex-1 cursor-pointer">
                  {word}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-sm">{selectedSuggestions.length} keywords selected</div>
          <Button onClick={addSelectedSuggestions} disabled={selectedSuggestions.length === 0} className="ml-auto">
            Add Selected Keywords
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
