"use client";
import { GenericDataTable } from "@/components/GenericDataTable";
import { Badge } from "@/components/ui";
import {
  DocumentsAccessType,
  DocumentsEntity,
  DocumentsType,
  TeamsEntity,
  UsersEntity,
} from "@/core/entities";
import { cn } from "@/lib/utils";
import { Globe, Key, Lock, Share2, Users } from "lucide-react";

interface DocumentsDataTableProps {
  data: DocumentsEntity[];
  onEdit?: (position: DocumentsEntity) => void;
  onDelete?: (position: DocumentsEntity) => void;
  onAdd?: () => void;
  users: UsersEntity[];
  teams: TeamsEntity[];
}

export function DocumentsDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  users,
  teams,
}: DocumentsDataTableProps) {
  const renderTypeBadge = (type: DocumentsType) => {
    return (
      <Badge
        className={cn(
          type === "CONTRACT" &&
            "bg-green-500/10 dark:text-green-600 text-green-700",
          type === "REPORT" &&
            "bg-blue-500/10 dark:text-blue-600 text-blue-700",
          type === "INVOICE" &&
            "bg-orange-500/10 dark:text-orange-600 text-orange-700",
          type === "MULTIMEDIA" &&
            "bg-purple-500/10 dark:text-purple-600 text-purple-700"
        )}
      >
        {type}
      </Badge>
    );
  };

  const renderAccesType = (access: DocumentsAccessType) => {
    return (
      <span className="flex items-center justify-start">
        <Badge variant={"outline"} className="border-none">
          {(access === "PRIVATE" && <Lock />) ||
            (access === "TEAM" && <Users />) ||
            (access === "SHARED" && <Share2 />) ||
            (access === "SHARED_PRIVATE" && <Key />) ||
            (access === "PUBLIC" && <Globe />)}
        </Badge>
        {access}
      </span>
    );
  };

  const customRenderUser = (id: string) => {
    const user = users.filter((u) => u.id!.toString() == id);
    return <span>{user[0].email!}</span>;
  };

  const renderTeam = (id: string) => {
    const team = teams.filter((t) => t.id!.toString() == id);
    return <span>{team[0].name}</span>;
  };

  return (
    <GenericDataTable<DocumentsEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      showAddButton={!!onAdd}
      customRenderers={{
        type: (value) => renderTypeBadge(value),
        accessType: (value) => renderAccesType(value),
        uploadedById: (value) => customRenderUser(value),
        teamId: (value) => renderTeam(value),
      }}
      excludeColumns={["hashAccess"]}
    />
  );
}
