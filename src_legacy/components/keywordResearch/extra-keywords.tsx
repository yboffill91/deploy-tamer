"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KeywordIcon } from "./keyword-icon";
import { useKeywords } from "@/hooks/key_research/use-keywords";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const ExtraKeywords = () => {
  const { keywords, input, inputRef, setInput, addKeyword, removeKeyword, handleKeyDown, handleKeyPress } =
    useKeywords("extra");

  const { addExtraKeyword, removeExtraKeyword } = useKeywordResearchStore();

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (input.trim() !== "") {
      addKeyword(e);
      addExtraKeyword(input.trim());
    }
  };

  const handleRemoveKeyword = (index: number) => {
    removeKeyword(index);
    removeExtraKeyword(index);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <KeywordIcon type="target" />
          Extra Positive Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            placeholder="Enter extra keyword"
            className="font-mono text-sm"
          />
          <Button type="button" size="icon" onClick={handleAddKeyword}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-4 flex h-32 flex-wrap content-start gap-2 overflow-y-auto rounded-md border p-2">
          {keywords.length === 0 && (
            <p className="text-muted-foreground w-full py-4 text-center">No extra keywords added</p>
          )}
          {keywords.map((keyword, index) => (
            <Badge
              key={`extra-${index}`}
              variant="secondary"
              className="hover:bg-secondary/80 group flex cursor-pointer items-center gap-2"
              onClick={() => handleRemoveKeyword(index)}
            >
              {keyword}
              <X className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
