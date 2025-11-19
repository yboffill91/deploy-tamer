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

interface CompaniesDataTableProps {
  data: DocumentsEntity[];
  onEdit?: (position: DocumentsEntity) => void;
  onDelete?: (position: DocumentsEntity) => void;
  onAdd?: () => void;
  users: UsersEntity[];
}

export function CompaniesDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  users,
}: CompaniesDataTableProps) {
  const renderUserEmail = (id: string) => {
    const user = users.filter((u) => u.id!.toString() == id);
    return <span>{user[0].email!}</span>;
  };

  const renderStatus = (status: string) => {
    return (
      <Badge
        className={cn(
          "text-xs",
          status === "POTENTIAL_CLIENT"
            ? "bg-orange-500/10 dark:text-orange-500 text-orange-700"
            : "bg-purple-500/10 dark:text-purple-500 text-purple-700"
        )}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <GenericDataTable<DocumentsEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      showAddButton={!!onAdd}
      customRenderers={{
        ownerId: (value) => renderUserEmail(value),
        status: (value) => renderStatus(value),
      }}
      excludeColumns={["hashAccess"]}
    />
  );
}
