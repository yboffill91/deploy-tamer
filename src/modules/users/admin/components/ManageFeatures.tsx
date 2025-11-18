"use client";

import { useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleFeature } from "./models";
import { FunctionalitiesEntity } from "@/core/entities";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { FunctionalitiesApiRepository } from "@/infrastructure/repositories";

interface FeaturesManagerProps {
  availableFeatures: FunctionalitiesEntity[];
  selectedFeatures: RoleFeature[];
  onFeaturesChange: (features: RoleFeature[]) => void;
}

export function FeaturesManager({
  availableFeatures,
  selectedFeatures,
  onFeaturesChange,
}: FeaturesManagerProps) {
  const [newFeatureName, setNewFeatureName] = useState("");
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
  const [selectedExistingFeature, setSelectedExistingFeature] =
    useState<string>("");
  const [updatedAvailableFeatures, setupdatedAvailableFeatures] =
    useState(availableFeatures);

  const feat_repo = new FunctionalitiesApiRepository();

  const selectedFeatureIds = useMemo(
    () => new Set(selectedFeatures.map((f) => f.functionalityId)),
    [selectedFeatures]
  );

  const isNewFeatureNameValid = (name: string) => {
    const trimmed = name.trim().toLowerCase();
    return (
      trimmed.length > 0 &&
      !updatedAvailableFeatures.some(
        (f) => f.name!.toLowerCase() === trimmed
      ) &&
      !selectedFeatures.some(
        (f) =>
          updatedAvailableFeatures
            .find((af) => Number(af.id) === f.functionalityId)
            ?.name!.toLowerCase() === trimmed
      )
    );
  };

  const handleAddExistingFeature = () => {
    if (!selectedExistingFeature) return;

    const featureId = Number(selectedExistingFeature);
    if (selectedFeatureIds.has(featureId)) return;

    const newFeature: RoleFeature = {
      functionalityId: featureId,
      mode: ["READ"],
    };

    onFeaturesChange([...selectedFeatures, newFeature]);
    setSelectedExistingFeature("");
  };

  const handleAddNewFeature = async () => {
    if (!isNewFeatureNameValid(newFeatureName)) return;

    const newFeature = await feat_repo.create({ name: newFeatureName });

    const newFeatureId = Number(newFeature.id!);

    const newFeatureMode: ["READ" | "WRITE" | "FULL_ACCESS"] = ["READ"];

    console.log(newFeature);
    const newFeatureToShow: RoleFeature = {
      functionalityId: newFeatureId,
      mode: newFeatureMode,
    };

    onFeaturesChange([...selectedFeatures, newFeatureToShow]);
    setupdatedAvailableFeatures([...updatedAvailableFeatures, newFeature]);
    setNewFeatureName("");
    setShowNewFeatureForm(false);
  };

  const handleModeChange = (
    featureId: number,
    mode: "READ" | "WRITE" | "FULL_ACCESS",
    checked: boolean
  ) => {
    onFeaturesChange(
      selectedFeatures.map((f) => {
        if (f.functionalityId !== featureId) return f;

        let newModes = [...f.mode];

        if (mode === "FULL_ACCESS") {
          if (checked) {
            newModes = ["READ", "WRITE"];
          } else {
            newModes = [...newModes];
          }
        } else if (mode === "READ" || mode === "WRITE") {
          if (checked) {
            if (!newModes.includes(mode)) newModes.push(mode);
          } else {
            newModes = newModes.filter((m) => m !== mode);
          }
        }

        newModes = Array.from(new Set(newModes));

        return { ...f, mode: newModes };
      })
    );
  };

  const getFeatureName = (functionalityId: number) => {
    const feature = updatedAvailableFeatures.find(
      (f) => Number(f.id) === functionalityId
    );

    return feature?.name;
  };

  const availableFeaturesForSelect = updatedAvailableFeatures.filter(
    (f) => !selectedFeatureIds.has(Number(f.id))
  );

  const handleRemoveFeature = (featureId: number) => {
    onFeaturesChange(
      selectedFeatures.filter((f) => f.functionalityId !== featureId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className="text-sm font-medium">Add Existing Feature</Label>
          <Select
            value={selectedExistingFeature}
            onValueChange={setSelectedExistingFeature}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select a feature..." />
            </SelectTrigger>
            <SelectContent>
              {availableFeaturesForSelect.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">
                  All features are already added
                </div>
              ) : (
                availableFeaturesForSelect.map((feature) => (
                  <SelectItem key={feature.id} value={String(feature.id)}>
                    {feature.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleAddExistingFeature}
          disabled={!selectedExistingFeature}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {!showNewFeatureForm ? (
        <Button
          variant="outline"
          onClick={() => setShowNewFeatureForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Feature
        </Button>
      ) : (
        <div className="flex gap-2 p-3 border rounded-md bg-muted/30">
          <div className="flex-1">
            <Input
              placeholder="Feature name..."
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNewFeature();
                }
              }}
            />
            {newFeatureName && !isNewFeatureNameValid(newFeatureName) && (
              <p className="text-xs text-destructive mt-1">
                Feature name already exists or is empty
              </p>
            )}
          </div>
          <Button
            onClick={handleAddNewFeature}
            disabled={!isNewFeatureNameValid(newFeatureName)}
          >
            Add
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowNewFeatureForm(false);
              setNewFeatureName("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {selectedFeatures.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger>R</TooltipTrigger>
                    <TooltipContent>Read</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger>W</TooltipTrigger>
                    <TooltipContent>Write</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>
                  <Tooltip>
                    <TooltipTrigger>FA</TooltipTrigger>
                    <TooltipContent>Full Access</TooltipContent>
                  </Tooltip>
                </TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedFeatures.map((feature) => (
                <TableRow key={feature.functionalityId}>
                  <TableCell className="font-medium">
                    {getFeatureName(feature.functionalityId)}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      id={`read-${feature.functionalityId}`}
                      checked={feature.mode.includes("READ")}
                      onCheckedChange={(checked) =>
                        handleModeChange(
                          feature.functionalityId,
                          "READ",
                          !!checked
                        )
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Checkbox
                      id={`write-${feature.functionalityId}`}
                      checked={feature.mode.includes("WRITE")}
                      onCheckedChange={(checked) =>
                        handleModeChange(
                          feature.functionalityId,
                          "WRITE",
                          !!checked
                        )
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Checkbox
                      id={`full-${feature.functionalityId}`}
                      checked={
                        feature.mode.includes("READ") &&
                        feature.mode.includes("WRITE")
                      }
                      onCheckedChange={(checked) =>
                        handleModeChange(
                          feature.functionalityId,
                          "FULL_ACCESS",
                          !!checked
                        )
                      }
                    />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleRemoveFeature(feature.functionalityId)
                      }
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove feature</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedFeatures.length === 0 && (
        <div className="p-6 text-center text-muted-foreground border rounded-md bg-muted/30">
          No features added yet. Add features to assign permissions to this
          role.
        </div>
      )}
    </div>
  );
}
