import { KeywordResultEntity } from '@/core/entities';
import { ColumnDef } from '@tanstack/react-table';
import { formatNumberAbbreviated } from './helpers/formatNumberAbbreviated';
import { DataTable } from '@/components/data-table/DataTable';
import { buildMonthColumns } from './BuildMonthColumns';
import { Badge } from '@/components/ui';

export const ReviewResultsDataDataTable = ({
  data,
}: {
  data: KeywordResultEntity[];
}) => {
  const ResultsColumns: ColumnDef<KeywordResultEntity>[] = [
    {
      accessorKey: 'keyword',
      header: 'Keywords',
      cell: ({ row }) => (
        <h3 className='capitalize'>{row.getValue<string>('keyword')}</h3>
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'search_volume',
      header: 'Volume',
      cell: ({ row }) => {
        const value = row.getValue<number>('search_volume');
        return <span>{formatNumberAbbreviated(value)}</span>;
      },
    },
    ...buildMonthColumns(),
    {
      accessorKey: 'competition',
      header: 'Competition',
      cell: ({ row }) => {
        const comp = row.original.competition ?? 'Unknown';

        const color =
          comp === 'HIGH'
            ? 'bg-red-500/10 text-red-500'
            : comp === 'MEDIUM'
            ? 'bg-orange-500/10 text-orange-500'
            : comp === 'LOW'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-gray-400/10 text-gray-500';

        return <Badge className={color}>{comp}</Badge>;
      },
    },
    {
      accessorKey: 'cpc',
      header: 'CPC',
      cell: ({ row }) => {
        const cpc = row.original.cpc;
        if (cpc == null) return <span>—</span>;
        return <span>${cpc.toFixed(2)}</span>;
      },
    },
  ];

  return <><DataTable data={data} columns={ResultsColumns} /></>;
};


