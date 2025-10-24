"use client";

import { Target, BanIcon } from "lucide-react";

interface KeywordIconProps {
  type: "target" | "negative";
}

export const KeywordIcon = ({ type }: KeywordIconProps) => {
  if (type === "target") {
    return <Target className="mr-2 h-5 w-5" />;
  }
  return <BanIcon className="mr-2 h-5 w-5" />;
};
