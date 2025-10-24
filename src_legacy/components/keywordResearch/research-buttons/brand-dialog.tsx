"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BrandDialog = ({ open, onOpenChange }: BrandDialogProps) => {
  // Datos de ejemplo
  const brandCategories = [
    {
      title: "Technology",
      brands: ["Apple", "Microsoft", "Google", "Samsung", "Sony"],
    },
    {
      title: "Automotive",
      brands: ["Toyota", "Honda", "Ford", "BMW", "Mercedes"],
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col">
        <SheetHeader className="pt-6 pr-8">
          <div className="flex items-center justify-between">
            <SheetTitle>Brand Filters</SheetTitle>
            <Button variant="outline" size="sm">
              <Wand2 className="mr-2 h-4 w-4" />
              Get Suggestions
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 flex-1 px-4">
          <div className="flex flex-wrap gap-4 space-y-6 pr-4">
            {brandCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="text-sm font-medium">{category.title}</h3>
                <div className="space-y-2">
                  {category.brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox id={brand} />
                      <Label htmlFor={brand} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
