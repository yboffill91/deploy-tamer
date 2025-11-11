"use client";

import { GenericDataTable } from "@/components/GenericDataTable";
import { RolesEntity, RolesFuncionalitiesDTO } from "@/core";

interface RolesDataTableProps {
  data: RolesEntity[];
  onEdit?: (role: RolesEntity) => void;
  onDelete?: (role: RolesEntity) => void;
  onAdd?: () => void;
}

export function RolesDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
}: RolesDataTableProps) {
  const renderFeatures = (roleFunctionality: RolesFuncionalitiesDTO[]) => {
    if (!roleFunctionality || roleFunctionality.length === 0) {
      return <span className="text-muted-foreground italic">No features</span>;
    }

    return (
      <div className="space-y-1">
        {roleFunctionality.slice(0, 2).map((feature) => (
          <div key={feature.functionalityId} className="text-xs">
            <span className="font-medium">ID {feature.functionalityId}:</span>{" "}
            <span className="text-muted-foreground">
              {feature.mode!.join(", ")}
            </span>
          </div>
        ))}
        {roleFunctionality.length > 2 && (
          <div className="text-xs text-muted-foreground">
            +{roleFunctionality.length - 2} more
          </div>
        )}
      </div>
    );
  };

  const displayData = data.map((role) => ({
    ...role,
    feature: role.roleFunctionality,
  }));

  return (
    <GenericDataTable<RolesEntity>
      data={displayData}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      excludeColumns={[
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "roleFunctionality",
      ]}
      showAddButton={!!onAdd}
      customRenderers={{
        feature: (value) => renderFeatures(value),
      }}
    />
  );
}
