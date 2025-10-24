"use client";

import { Button } from "@/components/ui/button";
import { Bell, Globe2, Languages, Building2 } from "lucide-react";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const ResearchButtons = () => {
  const { targetKeywords, setShowLanguageDialog, setShowRegionDialog, setShowBrandDialog, setShowNotificationsDialog } =
    useKeywordResearchStore();

  return (
    <>
      <Button onClick={() => setShowLanguageDialog(true)} className="whitespace-nowrap">
        <Languages className="h-4 w-4" />
        <span className="ml-2">Language</span>
      </Button>

      <Button onClick={() => setShowRegionDialog(true)} className="whitespace-nowrap">
        <Globe2 className="h-4 w-4" />
        <span className="ml-2">Region</span>
      </Button>

      <Button
        onClick={() => setShowBrandDialog(true)}
        className="whitespace-nowrap"
        /* disabled={targetKeywords.length === 0} */
      >
        <Building2 className="h-4 w-4" />
        <span className="ml-2">Brands</span>
      </Button>

      <Button onClick={() => setShowNotificationsDialog(true)} size="icon">
        <Bell className="h-4 w-4" />
      </Button>
    </>
  );
};
