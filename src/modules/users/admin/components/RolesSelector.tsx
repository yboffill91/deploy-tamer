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
import { RolesEntity } from "@/core";

interface RolesSelectorProps {
  availableRoles: RolesEntity[];
  selectedRoles: number[];
  onRolesChange: (roles: number[]) => void;
}

export function RolesSelector({
  availableRoles,
  selectedRoles,
  onRolesChange,
}: RolesSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Memoized set of already selected role IDs
  const selectedRolesSet = useMemo(
    () => new Set(selectedRoles),
    [selectedRoles]
  );

  const handleAddRole = () => {
    if (!selectedRole) return;

    const roleId = Number(selectedRole);
    if (selectedRolesSet.has(roleId)) return;

    onRolesChange([...selectedRoles, roleId]);
    setSelectedRole("");
  };

  const handleRemoveRole = (roleId: number) => {
    onRolesChange(selectedRoles.filter((id) => id !== roleId));
  };

  const getRoleName = (roleId: number): string => {
    const role = availableRoles.find((r) => r.id === roleId);
    return role?.name || `Role ID: ${roleId}`;
  };

  const availableRolesForSelect = availableRoles.filter(
    (r) => !selectedRolesSet.has(r.id!)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="role-select" className="text-sm font-medium">
            Add Role
          </Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role-select" className="mt-1 w-full">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {availableRolesForSelect.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">
                  All roles are already added
                </div>
              ) : (
                availableRolesForSelect.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddRole} disabled={!selectedRole} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {selectedRoles.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedRoles.map((roleId) => (
                <TableRow key={roleId}>
                  <TableCell className="font-medium">
                    {getRoleName(roleId)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRole(roleId)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove role</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedRoles.length === 0 && (
        <div className="p-6 text-center text-muted-foreground border rounded-md bg-muted/30">
          No roles added yet. Add roles to this position.
        </div>
      )}
    </div>
  );
}
