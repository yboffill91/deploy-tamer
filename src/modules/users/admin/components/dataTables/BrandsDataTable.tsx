"use client";
import { GenericDataTable } from "@/components/GenericDataTable";
import { BrandsEntity, CompanyEntity } from "@/core/entities";

interface BrandsDataTableProps {
  data: BrandsEntity[];
  onEdit?: (brand: BrandsEntity) => void;
  onDelete?: (brand: BrandsEntity) => void;
  onAdd?: () => void;
  companies: CompanyEntity[];
}

export function BrandsDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  companies,
}: BrandsDataTableProps) {
  const renderCompany = (id: string) => {
    const company = companies.filter((c) => c.id!.toString() == id);
    return <span>{company[0].name!}</span>;
  };

  return (
    <GenericDataTable<BrandsEntity>
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd ? () => onAdd() : undefined}
      showAddButton={!!onAdd}
      customRenderers={{
        companyId: (value) => renderCompany(value),
      }}
      excludeColumns={["notes"]}
    />
  );
}
