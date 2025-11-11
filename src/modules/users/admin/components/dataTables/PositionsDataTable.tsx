"use client";
import { GenericDataTable } from "@/components/GenericDataTable";
import { PositionsEntity, RolesEntity } from "@/core";

interface PositionsDataTableProps {
  data: PositionsEntity[];
  onEdit?: (position: PositionsEntity) => void;
  onDelete?: (position: PositionsEntity) => void;
  onAdd?: () => void;
}

export function PositionsDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: PositionsDataTableProps) {
  const renderRoles = (roles: RolesEntity[]) => {
    if (!roles || roles.length === 0) {
      return <span className="text-muted-foreground italic">No roles</span>;
    }

    return (
      <div className="space-y-1">
        {roles.slice(0, 4).map((rol, idx) => (
          <div key={idx} className="text-xs">
            <span className="font-medium">Role {rol.name}</span>
          </div>
        ))}
        {roles.length > 2 && (
          <div className="text-xs text-muted-foreground">
            +{roles.length - 2} more
          </div>
        )}
      </div>
    );
  };

  return (
    <GenericDataTable<PositionsEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      showAddButton={!!onAdd}
      customRenderers={{
        roles: (value) => renderRoles(value),
      }}
    />
  );
}
