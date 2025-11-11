"use client";

import { GenericDataTable } from "@/components/GenericDataTable";
import { PositionsEntity, UsersEntity } from "@/core";
import { TeamsEntity } from "@/core/entities";

interface UsersDataTableProps {
  data: UsersEntity[];
  onEdit?: (user: UsersEntity) => void;
  onDelete?: (user: UsersEntity) => void;
  onAdd?: () => void;
}

export function UsersDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: UsersDataTableProps) {
  const customRenderers = {
    position: (_: PositionsEntity, item: UsersEntity) => {
      return (
        item.position?.name || (
          <span className="text-muted-foreground italic">-</span>
        )
      );
    },
    team: (_: TeamsEntity, item: UsersEntity) => {
      return (
        item.team?.name || (
          <span className="text-muted-foreground italic">Unassigned</span>
        )
      );
    },
  };

  return (
    <GenericDataTable<UsersEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      showAddButton={!!onAdd}
      customRenderers={customRenderers}
      excludeColumns={[
        "uuid",
        "positionId",
        "infoId",
        "teamId",
        "positions",
        "uid",
        "photoURL",
        "displayName",
      ]}
    />
  );
}
