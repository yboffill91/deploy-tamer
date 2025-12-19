import { ColumnDef } from "@tanstack/react-table";
import { MONTH_MAP } from "./helpers/monthsMap";
import { KeywordResultEntity } from "@/core/entities";
import { getColorByValue } from "./helpers/cellColors";

export const buildMonthColumns = (): ColumnDef<KeywordResultEntity>[] => {
  return Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;

    return {
      accessorKey: `month_${monthNumber}`,
      header: MONTH_MAP[monthNumber],
      cell: ({ row }) => {
        const monthly = row.original.monthly_searches;

        const values = monthly.map((m) => m.search_volume);
        const min = Math.min(...values);
        const max = Math.max(...values);

        const current = monthly.find((m) => m.month === monthNumber);
        const value = current?.search_volume ?? 0;

        const backgroundColor = getColorByValue(value, min, max);

        return (
          <div
            style={{
              backgroundColor,
              padding: '6px 8px',
              borderRadius: '4px',
              textAlign: 'right',
              fontWeight: 500,
              margin: '0'

            }}

          >
            {value}
          </div>
        );
      },
      enableGrouping: false,
    };
  });
};
