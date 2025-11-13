"use client";

import { GenericDataTable } from "@/components/GenericDataTable";
import {
  Badge,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  Separator,
} from "@/components/ui";
import {
  FunctionalitiesEntity,
  RolesEntity,
  RolesFuncionalitiesDTO,
} from "@/core";
import { cn } from "@/lib/utils";

interface RolesDataTableProps {
  data: RolesEntity[];
  onEdit?: (role: RolesEntity) => void;
  onDelete?: (role: RolesEntity) => void;
  onAdd?: () => void;
  functionalities: FunctionalitiesEntity[];
}

export function RolesDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  functionalities,
}: RolesDataTableProps) {
  const renderFeatures = (roleFunctionality: RolesFuncionalitiesDTO[]) => {
    if (!roleFunctionality || roleFunctionality.length === 0) {
      return <span className="text-muted-foreground italic">No features</span>;
    }

    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <div className="space-y-1  flex items-center justify-start ">
              {roleFunctionality.slice(0, 2).map((feature, idx) => (
                <div
                  key={feature.functionalityId}
                  className={cn("text-xs pe-2")}
                >
                  <span className="font-medium">
                    {
                      functionalities.find(
                        (f) => f.id === feature.functionalityId
                      )?.name
                    }
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {feature.mode!.length === 2 ? (
                      <Badge className="py-pc px-1 text-[0.6rem] bg-orange-500/10 text-orange-600">
                        FULL ACCESS
                      </Badge>
                    ) : (
                      feature.mode!.map((m, idx) => (
                        <Badge
                          key={idx}
                          className={cn(
                            "text-[0.6rem] py-px px-1",
                            m === "READ"
                              ? "bg-blue-500/10 text-blue-800 dark:text-blue-300"
                              : m === "WRITE"
                              ? "bg-green-500/10 text-green-800 dark:text-green-300"
                              : "bg-orange-500/10 text-orange-800 dark:text-orange-300"
                          )}
                        >
                          {m}
                        </Badge>
                      ))
                    )}
                  </span>
                </div>
              ))}
              {roleFunctionality.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{roleFunctionality.length - 2} more
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <ul className="space-y-1 ">
              {roleFunctionality.map((feature) => (
                <li key={feature.functionalityId} className="text-xs">
                  <span className="font-medium">
                    {
                      functionalities.find(
                        (f) => f.id === feature.functionalityId
                      )?.name
                    }
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {feature.mode!.length === 2 ? (
                      <Badge className="py-pc px-1 text-[0.6rem] bg-orange-500/10 text-orange-600">
                        FULL ACCESS
                      </Badge>
                    ) : (
                      feature.mode!.map((m, idx) => (
                        <Badge
                          key={idx}
                          className={cn(
                            "text-[0.6rem] py-px px-1",
                            m === "READ"
                              ? "bg-blue-500/10 text-blue-800 dark:text-blue-300"
                              : m === "WRITE"
                              ? "bg-green-500/10 text-green-800 dark:text-green-300"
                              : "bg-orange-500/10 text-orange-800 dark:text-orange-300"
                          )}
                        >
                          {m}
                        </Badge>
                      ))
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </>
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
