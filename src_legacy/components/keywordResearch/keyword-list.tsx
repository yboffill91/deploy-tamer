"use client";

import { Plus, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { KeywordIcon } from "./keyword-icon";
import { useKeywords } from "@/hooks/key_research/use-keywords";

interface KeywordListProps {
  type: "target" | "negative";
}

export const KeywordList = ({ type }: KeywordListProps) => {
  const {
    keywords,
    input,
    inputRef,
    isLoading,
    error,
    setInput,
    addKeyword,
    removeKeyword,
    handleKeyDown,
    handleKeyPress,
    getSuggestions,
  } = useKeywords(type);

  const title = type === "target" ? "Target Keywords" : "Negative Keywords";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <KeywordIcon type={type} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 flex">
            {error}
          </Alert>
        )}

        <form onSubmit={addKeyword} className="mb-4 flex gap-2">
          <Input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            placeholder="Enter keyword"
            className="font-mono text-sm"
          />
          <Button type="submit" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        <div className="mb-4 flex h-64 flex-wrap content-start gap-2 overflow-y-auto rounded-md border p-2">
          {keywords.length === 0 && (
            <p className="text-muted-foreground w-full py-4 text-center">
              No {type === "negative" ? "negative " : ""}keywords added
            </p>
          )}
          {keywords.map((keyword, index) => (
            <Badge
              key={`${type}-${index}`}
              variant="secondary"
              className="hover:bg-secondary/80 group flex cursor-pointer items-center gap-2"
              onClick={() => removeKeyword(index)}
            >
              {keyword}
              <X className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
            </Badge>
          ))}
        </div>

        <Button
          variant="secondary"
          className="bg-input hover:bg-primary w-full"
          onClick={getSuggestions}
          disabled={isLoading}
        >
          <Bot className="mr-2 h-5 w-5" />
          <span className="hidden md:inline">Suggest {type === "negative" ? "Negative " : ""}Keywords with AI</span>
          <span className="md:hidden">Suggest {type === "negative" ? "Negative " : ""}KWs</span>
        </Button>
      </CardContent>
    </Card>
  );
};
