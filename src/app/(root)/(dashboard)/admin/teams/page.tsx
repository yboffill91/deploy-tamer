"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import {
  TeamsDataTable,
  UsersSelector,
} from "@/modules/users/admin/components";
import { TeamsEntity, UsersEntity } from "@/core/entities";
import { TeamsApiRepository } from "@/infraestructure/repositories/TeamsApiRepository";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CircleAlert, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { ControlledDialog } from "@/components/ControlledDialog";
import { UsersApiRepository } from "@/infraestructure/repositories";
import { requestCreateTeamDTO } from "@/core/dto";
import toast from "react-hot-toast";
import { CommonHeader } from "@/modules/users/admin";
import { CustomPageLoader } from "@/components/CustomPageLoader";

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamsEntity[] | null>(null);
  const [users, setUsers] = useState<UsersEntity[] | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamsEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<requestCreateTeamDTO>({
    name: "",
    description: "",
    usersIds: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamsEntity | null>(null);

  const [isError, setIsError] = useState<string | null>(null);

  const teams_repo = new TeamsApiRepository();
  const users_repo = new UsersApiRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const teams = await teams_repo.findAll();
        setTeams(teams);
        const users = await users_repo.findAll();
        setUsers(users);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(isError);
    }
  }, [isError]);

  const handleAddTeam = () => {
    setEditingTeam(null);
    setFormData({ name: "", description: "", usersIds: [] });
    setIsDialogOpen(true);
  };

  const handleEditTeam = (team: TeamsEntity) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description,
      usersIds: team.users?.map((user) => Number(user.id)) ?? [],
    });
    setIsDialogOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!formData.name!.trim()) {
      setIsError("Please enter a team name");
      return;
    }

    if (editingTeam) {
      if (!teams) {
        setIsError("Teams not found");
        return;
      }

      try {
        setIsUpdating(true);
        await teams_repo.update(editingTeam.id + "", formData);
        const teams = await teams_repo.findAll();
        setTeams(teams);
        toast.success("Team updated successfully");
      } catch (error) {
        setIsUpdating(false);
        setIsError(
          error instanceof Error
            ? error.message
            : "Something went wrong updating team"
        );
      } finally {
        setIsDialogOpen(false);
        setIsUpdating(false);
      }
    } else {
      const newTeam: requestCreateTeamDTO = Object.assign(
        new requestCreateTeamDTO(),
        formData
      );

      try {
        setIsCreating(true);
        await teams_repo.create(newTeam);
        const teams = await teams_repo.findAll();
        setTeams(teams);
        toast.success("Team created successfully");
      } catch (error) {
        setIsCreating(false);
        setIsError(
          error instanceof Error
            ? error.message
            : "Something went wrong creating team"
        );
      } finally {
        setIsDialogOpen(false);
        setIsCreating(false);
      }
    }
  };

  const handleDeleteTeam = (team: TeamsEntity) => {
    setTeamToDelete(team);
    setConfirm(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) {
      setIsError("Nothing to delete");
      return;
    }

    try {
      setIsDeleting(true);
      await teams_repo.delete(String(teamToDelete.id));
      toast.success(`Team "${teamToDelete.name}" deleted successfully`);
      const teams = await teams_repo.findAll();
      setTeams(teams);
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : `Error Deleting Team ${teamToDelete.name}`
      );
    } finally {
      setIsDeleting(false);
      setConfirm(false);
      setTeamToDelete(null);
    }
  };

  return (
    <>
      {isLoading && <CustomPageLoader message="Loading Teams data" />}
      {!isLoading && !teams && (
        <CustomEmpty
          icon={CircleAlert}
          title="No Teams"
          description="No teams found"
          onClick={handleAddTeam}
        />
      )}
      {teams && !isLoading && (
        <main>
          <div>
            <CommonHeader
              icon={ClipboardList}
              title="Teams Management"
              desc="Manage your organization teams and assigned users"
            />
            <Card className="container">
              <CardContent>
                <ControlledDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  title={editingTeam ? "Edit Team" : "Create New Team"}
                  description={
                    editingTeam
                      ? "Update team details and members"
                      : "Create a new team and assign users"
                  }
                >
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        placeholder="e.g., Engineering Team"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team-description">Description</Label>
                      <Textarea
                        id="team-description"
                        placeholder="Team description..."
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

                    <div className="space-y-3">
                      <Label>Assign Users</Label>
                      {users ? (
                        <UsersSelector
                          availableUsers={users}
                          selectedUserIds={formData.usersIds ?? []}
                          onUsersChange={(usersIds) =>
                            setFormData({ ...formData, usersIds: usersIds })
                          }
                        />
                      ) : (
                        <CustomLoading message="Loading Users Data" />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveTeam}
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating ? (
                        <CustomLoading message="Creating Team" />
                      ) : isUpdating ? (
                        <CustomLoading message="Updating Team" />
                      ) : (
                        "Save Team"
                      )}
                    </Button>
                  </div>
                </ControlledDialog>

                <ControlledDialog
                  open={confirm}
                  onOpenChange={setConfirm}
                  title="Confirm Delete"
                  description={`Are you sure you want to delete the team ${teamToDelete?.name}? This action cannot be undone.`}
                >
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => setConfirm(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmDeleteTeam}>
                      {isDeleting ? (
                        <CustomLoading message="Deleting Team" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </ControlledDialog>

                <TeamsDataTable
                  data={teams}
                  onEdit={handleEditTeam}
                  onDelete={handleDeleteTeam}
                  onAdd={handleAddTeam}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </>
  );
}
