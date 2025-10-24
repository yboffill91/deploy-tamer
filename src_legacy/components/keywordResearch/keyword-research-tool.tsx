"use client";

import { Header } from "./header";
import { TitleInput } from "./title-input";
import { KeywordList } from "./keyword-list";
import { ExtraKeywords } from "./extra-keywords";
import { SearchIntent } from "./search-intent";
import { SuggestionsDialog } from "./suggestions-dialog";
import { CitiesCard } from "./cities-card";
import { BrandDialog } from "./research-buttons/brand-dialog";
import { LanguageDialog } from "./research-buttons/language-dialog";
import { RegionDialog } from "./research-buttons/region-dialog";
import { NotificationsDialog } from "./research-buttons/notifications-dialog";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const KeywordResearchTool = () => {
  const {
    // Dialog states
    showLanguageDialog,
    showRegionDialog,
    showBrandDialog,
    showNotificationsDialog,

    // Dialog actions
    setShowLanguageDialog,
    setShowRegionDialog,
    setShowBrandDialog,
    setShowNotificationsDialog,

    // Selection states
    selectedLanguage,
    selectedRegion,

    // Selection actions
    setSelectedLanguage,
    setSelectedRegion,
  } = useKeywordResearchStore();

  return (
    <div className="mx-auto max-w-6xl p-6 pt-12">
      <Header />

      <TitleInput />

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <KeywordList type="target" />
        <KeywordList type="negative" />
      </div>

      <CitiesCard />

      <ExtraKeywords />

      <SearchIntent />

      <SuggestionsDialog type="target" />
      <SuggestionsDialog type="negative" />

      <BrandDialog open={showBrandDialog} onOpenChange={setShowBrandDialog} />

      <LanguageDialog
        open={showLanguageDialog}
        onOpenChange={setShowLanguageDialog}
        selectedLanguage={selectedLanguage}
        onSelect={setSelectedLanguage}
      />

      <RegionDialog
        open={showRegionDialog}
        onOpenChange={setShowRegionDialog}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
      />

      <NotificationsDialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog} />
    </div>
  );
};
