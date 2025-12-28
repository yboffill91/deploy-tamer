import { KeywordResultEntity } from '@/core/entities';
import { ColumnDef } from '@tanstack/react-table';
import { formatNumberAbbreviated } from './helpers/formatNumberAbbreviated';
import { DataTable } from '@/components/data-table/DataTable';
import { buildMonthColumns } from './BuildMonthColumns';
import { Badge } from '@/components/ui';
import { TableHeadLabel } from './TableHeadLabel';
import { cn } from '@/lib/utils';

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
      accessorKey: 'Search Volume',
      header: () => <TableHeadLabel label='Volume' isCentered />,
      cell: ({ row }) => {
        const value = row.original.search_volume;
        return <span className='w-full text-center'>{value}</span>;
      },
    },
    ...buildMonthColumns(),
    {
      accessorKey: 'competition',
      header: 'Competition',
      cell: ({ row }) => {
        const comp = row.original.competition ?? 'Unknown';
        return (
          <Badge
            variant='outline'
            className={cn(
              'w-full capitalize border-none bg-transparent ',
              comp === 'HIGH' && 'text-destructive',
              comp === 'MEDIUM' ? 'text-warning' : 'text-success'
            )}
          >
            {comp.toLowerCase()}
          </Badge>
        );
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
            variant={'outline'}
            className={cn(
              'w-full border-none bg-transparent',
              cpc > 2
                ? 'text-success'
                : cpc > 1
                ? 'text-warning'
                : 'text-destructive'
            )}
          >
            {cpc.toFixed(2)}
          </Badge>
        );
      },
    },
  ];

  return (
    <>
      <DataTable data={data} columns={ResultsColumns} />
    </>
  );
};


