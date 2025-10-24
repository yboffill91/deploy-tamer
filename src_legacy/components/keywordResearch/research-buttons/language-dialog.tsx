"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SelectedLanguage } from "@/types/keyword-request";

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: SelectedLanguage | null;
  onSelect: (language: SelectedLanguage | null) => void;
}

export const LanguageDialog = ({ open, onOpenChange, selectedLanguage, onSelect }: LanguageDialogProps) => {
  const languages = [
    { name: "English", type: "Primary" },
    { name: "Spanish", type: "Secondary" },
    { name: "French", type: "Secondary" },
    { name: "German", type: "Secondary" },
    { name: "Portuguese", type: "Secondary" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="pt-6 pr-8">
          <SheetTitle>Language Selection</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-4">
          {languages.map((language) => (
            <Button
              key={language.name}
              variant={selectedLanguage?.name === language.name ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelect(language)}
            >
              {language.name}
              <span className="text-muted-foreground ml-2 text-sm">({language.type})</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
