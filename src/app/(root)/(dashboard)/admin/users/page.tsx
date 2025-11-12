"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { PositionsEntity, requestUsersDTO, UsersEntity } from "@/core";
import {
  PositionSelect,
  UsersDataTable,
} from "@/modules/users/admin/components";
import {
  PositionsApiRepository,
  UsersApiRepository,
} from "@/infraestructure/repositories";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomEmpty } from "@/components/CustomEmpty";
import { AlertTriangle, Users } from "lucide-react";
import { ControlledDialog } from "@/components/ControlledDialog";
import { Card, CardContent } from "@/components/ui";
import { CommonHeader } from "@/modules/users/admin";
import { CustomPageLoader } from "@/components/CustomPageLoader";
import { showToast } from "@/components/CustomToaster";

export default function UsersPage() {
  const [users, setUsers] = useState<UsersEntity[] | null>(null);
  const [positions, setPositions] = useState<PositionsEntity[] | null>(null);
  const [userToDelete, setUserToDelete] = useState<UsersEntity | null>(null);
  const [editingUser, setEditingUser] = useState<UsersEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<requestUsersDTO>({
    email: "",
    positionId: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const user_repo = new UsersApiRepository();
  const pos_repository = new PositionsApiRepository();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const users = await user_repo.findAll();
        const positions = await pos_repository.findAll();
        setUsers(users);
        setPositions(positions);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error fetching data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getData();
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

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ email: "", positionId: undefined });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: UsersEntity) => {
    setEditingUser(user);
    setFormData({
      email: user.email!,
      positionId: user.positionId!,
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!formData.email!.trim()) {
      setIsError("Please enter an email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email!)) {
      setIsError("Please enter a valid email");
      return;
    }

    if (!formData.positionId) {
      setIsError("Please select a position");
      return;
    }

    if (editingUser) {
      try {
        setIsUpdating(true);
        await user_repo.update(editingUser.id!.toString(), formData);
        const newUser = await user_repo.findAll();
        setUsers(newUser);
        showToast({
          message: "Success",
          type: "success",
          description: "User updated successfully",
        });
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error updating user"
        );
      } finally {
        setIsUpdating(false);
        setIsDialogOpen(false);
      }
    } else {
      try {
        setIsCreating(true);
        await user_repo.create(formData);
        const newUser = await user_repo.findAll();
        setUsers(newUser);
        showToast({
          message: "Success",
          type: "success",
          description: "User created successfully",
        });
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Error creating user"
        );
      } finally {
        setIsCreating(false);
        setIsDialogOpen(false);
      }
    }
  };

  const handleDelete = (user: UsersEntity) => {
    setUserToDelete(user);
    setConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) {
      setIsError("Nothing to delete");
      return;
    }

    try {
      setIsDeleting(true);
      await user_repo.delete(String(userToDelete.id));
      showToast({
        message: "Success",
        type: "success",
        description: `User "${userToDelete.email}" deleted successfully`,
      });
      const users = await user_repo.findAll();
      setUsers(users);
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : `Error Deleting User ${userToDelete.email}`
      );
    } finally {
      setIsDeleting(false);
      setConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ email: "", positionId: undefined });
  };

  return (
    <>
      {isLoading && <CustomPageLoader message="Loading Users Data" />}
      {users && (
        <main>
          <div className="space-y-6">
            <CommonHeader
              icon={Users}
              title={"Users Management"}
              desc={"Manage your organization users and their positions"}
            />
            <ControlledDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              title={editingUser ? "Edit User" : "Create New User"}
              description={
                editingUser
                  ? "Update user details. ID: " + editingUser.id
                  : "Create a new user and assign a position"
              }
            >
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                {positions && (
                  <PositionSelect
                    availablePositions={positions}
                    selectedPositionId={formData.positionId!}
                    onPositionChange={(positionId) =>
                      setFormData({
                        ...formData,
                        positionId: positionId as number,
                      })
                    }
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  {isUpdating ? (
                    <CustomLoading message="Updating User" />
                  ) : isCreating ? (
                    <CustomLoading message="Creating User" />
                  ) : (
                    "Save User"
                  )}
                </Button>
              </div>
            </ControlledDialog>

            <ControlledDialog
              open={confirm}
              onOpenChange={setConfirm}
              title="Confirm Delete"
              description={`Are you sure you want to delete the User ${userToDelete?.email}? This action cannot be undone.`}
            >
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  {isDeleting ? (
                    <CustomLoading message="Deleting User" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </ControlledDialog>
            <Card className="container">
              <CardContent>
                <UsersDataTable
                  data={users}
                  onEdit={handleEditUser}
                  onDelete={handleDelete}
                  onAdd={handleAddUser}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      )}
      {!isLoading && (!users || users.length === 0) && (
        <CustomEmpty
          title="No Users created yet"
          description="Create a new user to get started"
          icon={AlertTriangle}
          onClick={handleAddUser}
        />
      )}
    </>
  );
}
