"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SelectedRegion } from "@/types/keyword-request";

interface RegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRegion: SelectedRegion[] | undefined;
  onSelect: (regions: SelectedRegion[]) => void;
}

export const RegionDialog = ({ open, onOpenChange, selectedRegion = [], onSelect }: RegionDialogProps) => {
  const regions = [
    { name: "North America", type: "Continent" },
    { name: "Europe", type: "Continent" },
    { name: "Asia", type: "Continent" },
    { name: "United States", type: "Country" },
    { name: "United Kingdom", type: "Country" },
    { name: "Germany", type: "Country" },
    { name: "Spain", type: "Country" },
  ];

  const handleRegionToggle = (region: SelectedRegion) => {
    const isSelected = selectedRegion.some((r) => r.name === region.name);
    if (isSelected) {
      onSelect(selectedRegion.filter((r) => r.name !== region.name));
    } else {
      onSelect([...selectedRegion, region]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="pt-6 pr-8">
          <SheetTitle>Region Selection</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-2 px-4">
          {regions.map((region) => {
            const isSelected = selectedRegion.some((r) => r.name === region.name);
            return (
              <Button
                key={region.name}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleRegionToggle(region)}
              >
                {region.name}
                <span className="text-muted-foreground ml-2 text-sm">({region.type})</span>
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
