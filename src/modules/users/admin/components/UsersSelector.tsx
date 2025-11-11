"use client";

import { useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { UsersEntity } from "@/core";

interface UsersSelectorProps {
  availableUsers: UsersEntity[];
  selectedUserIds: number[];
  onUsersChange: (userIds: number[]) => void;
}

export function UsersSelector({
  availableUsers,
  selectedUserIds,
  onUsersChange,
}: UsersSelectorProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");

  const selectedUsersSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds]
  );

  const handleAddUser = () => {
    if (!selectedUser) return;

    const userId = Number(selectedUser);
    if (selectedUsersSet.has(userId)) return;

    onUsersChange([...selectedUserIds, userId]);
    setSelectedUser("");
  };

  const handleRemoveUser = (userId: number) => {
    onUsersChange(selectedUserIds.filter((id) => id !== userId));
  };

  const getUserInfo = (userId: number): UsersEntity | undefined => {
    return availableUsers.find((u) => u.id! === userId);
  };

  const availableUsersForSelect = availableUsers.filter(
    (u) => !selectedUsersSet.has(Number(u.id))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="user-select" className="text-sm font-medium">
            Add User
          </Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger id="user-select" className="mt-1">
              <SelectValue placeholder="Select a user..." />
            </SelectTrigger>
            <SelectContent>
              {availableUsersForSelect.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">
                  All users are already added
                </div>
              ) : (
                availableUsersForSelect.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddUser} disabled={!selectedUser} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {selectedUserIds.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedUserIds.map((userId) => {
                const user = getUserInfo(userId);
                return (
                  <TableRow key={userId}>
                    <TableCell className="font-medium">{user?.email}</TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUser(userId)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove user</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUserIds.length === 0 && (
        <div className="p-6 text-center text-muted-foreground border rounded-md bg-muted/30">
          No users added yet. Add users to this team.
        </div>
      )}
    </div>
  );
}
