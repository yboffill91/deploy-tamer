"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PositionsEntity } from "@/core";

interface PositionSelectProps {
  availablePositions: PositionsEntity[];
  selectedPositionId: number | null;
  onPositionChange: (positionId: number | null) => void;
}

export function PositionSelect({
  availablePositions,
  selectedPositionId,
  onPositionChange,
}: PositionSelectProps) {
  const selectedRolesSet = useMemo(
    () => new Set(selectedPositionId ? [selectedPositionId] : []),
    [selectedPositionId]
  );

  const handlePositionChange = (value: string) => {
    const positionId = value ? Number.parseInt(value, 10) : null;
    onPositionChange(positionId);
  };

  const handleRemovePosition = () => {
    onPositionChange(null);
  };

  const getPositionName = (positionId: number): string => {
    const position = availablePositions.find(
      (p) => String(p.id) === String(positionId)
    );
    return position?.name || `Position ID: ${positionId}`;
  };

  const getPositionDescription = (positionId: number): string => {
    const position = availablePositions.find(
      (p) => String(p.id) === String(positionId)
    );
    return position?.description || "";
  };

  return (
    <div className="space-y-4">
      {/* Position selector */}
      <div className="space-y-2">
        <Label htmlFor="position-select" className="text-sm font-medium">
          Select Position
        </Label>
        <Select
          value={selectedPositionId?.toString() || ""}
          onValueChange={handlePositionChange}
        >
          <SelectTrigger id="position-select">
            <SelectValue placeholder="Choose a position..." />
          </SelectTrigger>
          <SelectContent>
            {availablePositions.length === 0 ? (
              <div className="p-2 text-xs text-muted-foreground">
                No positions available
              </div>
            ) : (
              availablePositions.map((position) => (
                <SelectItem key={position.id} value={String(position.id)}>
                  {position.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Selected position card */}
      {selectedPositionId && (
        <div className="rounded-md border bg-muted/30 p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">
                  {getPositionName(selectedPositionId)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Position ID: {selectedPositionId}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemovePosition}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove position</span>
              </Button>
            </div>
            {getPositionDescription(selectedPositionId) && (
              <p className="text-xs text-foreground">
                {getPositionDescription(selectedPositionId)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!selectedPositionId && (
        <div className="p-6 text-center text-muted-foreground border rounded-md bg-muted/30">
          <p className="text-sm">
            No position assigned. Select a position above.
          </p>
        </div>
      )}
    </div>
  );
}
