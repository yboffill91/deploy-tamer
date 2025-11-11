"use client";

import { GenericDataTable } from "@/components/GenericDataTable";
import { TeamsEntity } from "@/core/entities";

interface TeamsDataTableProps {
  data: TeamsEntity[];
  onEdit?: (team: TeamsEntity) => void;
  onDelete?: (team: TeamsEntity) => void;
  onAdd?: () => void;
}

export function TeamsDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: TeamsDataTableProps) {
  const renderUsers = (users: TeamsEntity["users"]) => {
    const emails: string[] = [];
    users?.map((u) => emails.push(u.email!));
    return emails.length > 2
      ? emails.slice(0, 2).join(", ") + " & " + (emails.length - 2) + " more"
      : emails.join(", ");
  };

  return (
    <GenericDataTable<TeamsEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      excludeColumns={["companyId"]}
      showAddButton={!!onAdd}
      customRenderers={{
        users: (value: TeamsEntity["users"]) => renderUsers(value),
      }}
    />
  );
}
