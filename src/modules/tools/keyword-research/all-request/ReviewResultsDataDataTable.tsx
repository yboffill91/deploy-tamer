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
        return <Badge variant={comp === 'HIGH' ? 'destructive' : comp === 'MEDIUM' ? 'warning' : 'success'} className='w-full'>{comp}</Badge>;
      },
    },
    {
      accessorKey: 'cpc',
      header: 'CPC-(USD)',
      cell: ({ row }) => {
        const cpc = row.original.cpc;
        if (cpc == null) return <span>—</span>;
        return (
          <Badge
            variant={cpc > 2 ? 'success' : cpc > 1 ? 'info' : 'destructive'} className='w-full'
          >
            {cpc.toFixed(2)}
          </Badge>
        );
      },
    },
  ];

  return <><DataTable data={data} columns={ResultsColumns} /></>;
};


