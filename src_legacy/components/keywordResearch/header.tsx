"use client";

import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="mb-8 flex items-start justify-between border-b pb-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold">Keyword Research Tool</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Enterprise-grade keyword research automation powered by advanced AI. Leverage the same strategic approach used
          by industry leaders to discover high-impact keywords, filter out irrelevant terms, and analyze search intent
          patterns.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => globalThis.open("#", "_blank")}
        className="group relative ml-4 hidden min-w-[200px] px-4 md:flex"
      >
        <Video className="mr-2 h-6 w-6" />
        <span>See how it works</span>
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
        </span>
      </Button>
    </div>
  );
};
