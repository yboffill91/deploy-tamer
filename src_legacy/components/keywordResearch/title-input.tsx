"use client";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { ResearchButtons } from "./research-buttons/research-buttons";
import { useKeywordResearchStore } from "@/stores/key_research/keyword-research-store";

export const TitleInput = () => {
  const { title, volume, setTitle, setVolume } = useKeywordResearchStore();

  // Redondea el volumen al múltiplo de 10 más cercano
  const handleVolumeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      const roundedValue = Math.ceil(value / 10) * 10;
      setVolume(roundedValue);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Research Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Input del título */}
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your keyword research"
              className="font-mono text-sm"
            />
          </div>

          {/* Input del volumen */}
          <div className="w-48">
            <Input
              type="number"
              min={10}
              step={10}
              value={volume.toString()} // React input necesita string
              onChange={(e) => setVolume(Number(e.target.value))} // siempre número
              onBlur={handleVolumeBlur}
              placeholder="Search volume"
              className="font-mono text-sm"
            />
          </div>

          {/* Botones de investigación */}
          <div className="flex items-center gap-2">
            <ResearchButtons />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
