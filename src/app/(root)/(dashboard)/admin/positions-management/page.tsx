"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { PositionFormData } from "@/modules/users/admin/components/models";
import {
  PositionsDataTable,
  RolesSelector,
} from "@/modules/users/admin/components";
import { Card, CardContent } from "@/components/ui";
import { ControlledDialog } from "@/components/ControlledDialog";
import { PositionsDTO, PositionsEntity, RolesEntity } from "@/core";
import {
  PositionsApiRepository,
  RolesApiRepository,
} from "@/infrastructure/repositories";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomEmpty } from "@/components/CustomEmpty";
import { AlertTriangle, LayoutList } from "lucide-react";
import { CommonHeader } from "@/modules/users/admin";
import { CustomPageLoader } from "@/components/CustomPageLoader";
import { showToast } from "@/components/CustomToaster";

export default function PositionsPage() {
  const [positions, setPositions] = useState<PositionsEntity[] | null>(null);
  const [editingPosition, setEditingPosition] =
    useState<PositionsEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PositionFormData>({
    name: "",
    description: "",
    roles: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RolesEntity[] | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmPosition, setConfirmPosition] = useState(false);
  const [positionToDelete, setPositionToDelete] =
    useState<PositionsEntity | null>(null);

  const pos_repo = new PositionsApiRepository();
  const roles_repo = new RolesApiRepository();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const pos_data = await pos_repo.findAll();
        const roles_data = await roles_repo.findAll();
        setPositions(pos_data);
        setRoles(roles_data);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error loading data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
    if (isError) {
      showToast({
        message: "Error",
        type: "error",
        description: isError,
      });
      setIsError(null);
    }
  }, []);

  useEffect(() => {
    if (isError) {
      showToast({
        message: "Error",
        type: "error",
        description: isError,
      });
    }
  }, [isError]);

  const handleAddPosition = () => {
    setEditingPosition(null);
    setFormData({ name: "", description: "", roles: [] });
    setIsDialogOpen(true);
  };
  const handleSavePosition = async () => {
    if (!formData.name.trim()) {
      setIsError("Please enter a position name");
      return;
    }

    if (!positions) return;

    const positionToAdd = {
      name: formData.name,
      description:
        formData.description.length <= 1
          ? "Undescribted"
          : formData.description,
      roles: formData.roles,
    };

    try {
      setIsCreating(true);
      await pos_repo.create(positionToAdd);
      showToast({
        message: "Success",
        type: "success",
        description: "Position added successfully",
      });
      const newPositions = await pos_repo.findAll();
      setPositions(newPositions);
    } catch (e) {
      setIsError(
        e instanceof Error ? e.message : "Error creating new position"
      );
    } finally {
      setIsCreating(false);
      setIsDialogOpen(false);
    }
  };

  const handleEdit = async (id: string) => {
    const posiToEdit = await pos_repo.findById(id);

    setFormData({
      name: posiToEdit.name!,
      description: posiToEdit.description!,
      roles: posiToEdit.roles!.map((rol) => rol.id!),
    });
    setEditingPosition(posiToEdit);
    setShowEdit(true);
  };

  const handleSaveEdit = async (id: string) => {
    if (!formData.name.trim()) {
      setIsError("Position Name is required");
      return;
    }
    try {
      setIsUpdating(true);
      const updatePosition: PositionsDTO = {
        name: formData.name,
        description:
          formData.description.length <= 1
            ? "Undescribed"
            : formData.description,
        roles: formData.roles,
      };

      await pos_repo.update(id, updatePosition);
      showToast({
        message: "Success",
        type: "success",
        description: "Position updated successfully",
      });
      const newPositions = await pos_repo.findAll();
      setPositions(newPositions);
    } catch (e) {
      setIsError(e instanceof Error ? e.message : "Error updating position");
    } finally {
      setIsUpdating(false);
      setIsDialogOpen(false);
    }
  };
  const handleDelete = (position: PositionsEntity) => {
    setPositionToDelete(position);
    setConfirmPosition(true);
  };

  const confirmDelete = async () => {
    if (!positionToDelete) return;

    try {
      await pos_repo.delete(String(positionToDelete.id));
      showToast({
        message: "Success",
        type: "success",
        description: `Position "${positionToDelete.name}" deleted successfully`,
      });
      const newPositions = await pos_repo.findAll();
      if (newPositions.length === 0) {
        setPositions(null);
      }
      setPositions(newPositions);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "Error deleting position"
      );
    } finally {
      setConfirmPosition(false);
      setPositionToDelete(null);
    }
  };

  return (
    <>
      {isLoading && <CustomPageLoader message="Loading Positions" />}
      {!isLoading && positions && positions.length > 0 && (
        <div>
          <CommonHeader
            icon={LayoutList}
            title={"Positions Management"}
            desc={"Manage your organization positions and assigned roles"}
          />

          <Card>
            <CardContent>
              <PositionsDataTable
                data={positions!}
                onAdd={handleAddPosition}
                onEdit={(data) => handleEdit(data.id!)}
                onDelete={(position) => handleDelete(position)}
              />
            </CardContent>
          </Card>
        </div>
      )}
      {!isLoading && (positions === null || positions.length === 0) && (
        <CustomEmpty
          title="No Positions Created Yet!"
          icon={AlertTriangle}
          description="You have not created any positions yet."
          onClick={handleAddPosition}
        />
      )}
      <>
        {/* Dialogs */}
        <ControlledDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingPosition ? "Edit Position" : "Create New Position"}
          description={
            editingPosition
              ? "Update position details and roles"
              : "Create a new position and assign roles"
          }
        >
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="position-name">Position Name</Label>
              <Input
                id="position-name"
                placeholder="e.g., Senior Developer"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-description">Description</Label>
              <Textarea
                id="position-description"
                placeholder="Position description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            {isLoading && <CustomLoading message="Loading Roles Info" />}
            {roles && (
              <div className="space-y-3">
                <Label>Assign Roles</Label>
                <RolesSelector
                  availableRoles={roles}
                  selectedRoles={formData.roles}
                  onRolesChange={(roles) => setFormData({ ...formData, roles })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePosition}>
              {isCreating ? (
                <CustomLoading message="Creating Position" />
              ) : (
                "Create Position"
              )}
            </Button>
          </div>
        </ControlledDialog>

        {/* Edit Dialog */}
        <ControlledDialog
          open={showEdit}
          onOpenChange={setShowEdit}
          title={editingPosition ? "Edit Position" : "Create New Position"}
          description={
            editingPosition
              ? "Update position details and roles"
              : "Create a new position and assign roles"
          }
        >
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="position-name">Position Name</Label>
              <Input
                id="position-name"
                placeholder="e.g., Senior Developer"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-description">Description</Label>
              <Textarea
                id="position-description"
                placeholder="Position description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            {isLoading && <CustomLoading message="Loading Roles Info" />}
            {roles && (
              <div className="space-y-3">
                <Label>Assign Roles</Label>
                <RolesSelector
                  availableRoles={roles}
                  selectedRoles={formData.roles}
                  onRolesChange={(roles) => setFormData({ ...formData, roles })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                editingPosition && handleSaveEdit(editingPosition.id!)
              }
            >
              {isUpdating ? (
                <CustomLoading message="Updating Position" />
              ) : (
                "Update Position"
              )}
            </Button>
          </div>
        </ControlledDialog>

        {/* Delete Dialog */}
        <ControlledDialog
          open={confirmPosition}
          onOpenChange={setConfirmPosition}
          title="Confirm Delete"
          description={`Are you sure you want to delete the position "${positionToDelete?.name}"? This action cannot be undone.`}
        >
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmPosition(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </ControlledDialog>
      </>
    </>
  );
}
