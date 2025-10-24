"use client";

import { Crosshair, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";
import { useCreateKeywordResearch } from "@/hooks/key_research/use-keyword-research";

export const SearchIntent = () => {
  const { searchType, setSearchType, title, volume, targetKeywords, brandFilters } = useKeywordResearchStore();
  const { mutate: createResearch, isPending } = useCreateKeywordResearch();

  const hasValidTitle = title && title.trim() !== "";
  /* const hasValidFilters = Object.keys(brandFilters).length > 0 */
  const hasValidKeywords = targetKeywords.length > 0;

  const isFormDisabled = isPending || !hasValidTitle || !hasValidKeywords;

  const handleSubmit = () => {
    createResearch();
  };

  return (
    <Card className="bg-primary text-primary-foreground mt-8">
      <CardContent className="">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div>
            <h2 className="mb-3 flex items-center text-lg font-semibold">
              <Crosshair className="mr-2 h-5 w-5" />
              Search Intent
            </h2>
            <RadioGroup value={searchType} onValueChange={setSearchType} className="flex space-x-4 md:space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="transactional"
                  id="transactional"
                  className="border-primary-foreground text-primary-foreground"
                  disabled={isFormDisabled}
                />
                <Label htmlFor="transactional" className="text-primary-foreground">
                  Transactional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="informational"
                  id="informational"
                  className="border-primary-foreground text-primary-foreground"
                  disabled={isFormDisabled}
                />
                <Label htmlFor="informational" className="text-primary-foreground">
                  Informational
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isFormDisabled}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full px-8 md:w-auto"
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
            <span className="hidden md:inline">{isPending ? "Processing..." : "Run Keyword Research"}</span>
            <span className="md:hidden">{isPending ? "Processing..." : "Run Research"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
