"use client";

import { GenericDataTable } from "@/components/GenericDataTable";
import { FunctionalitiesEntity } from "@/core";

interface FunctionalitiesDataTableProps {
  data: FunctionalitiesEntity[];
  onEdit?: (functionality: FunctionalitiesEntity) => void;
  onDelete?: (functionality: FunctionalitiesEntity) => void;
  onAdd?: () => void;
}

export function FunctionalitiesDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: FunctionalitiesDataTableProps) {
  return (
    <GenericDataTable<FunctionalitiesEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      excludeColumns={["id", "createdAt", "updatedAt", "deletedAt"]}
      showAddButton={!!onAdd}
    />
  );
}
