import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import { KeywordResultEntity } from '@/core/entities';

import { ActionsButtonSet } from '@/components/data-table/ActionsButtons';
import { ChartArea } from 'lucide-react';
import { DataTable } from '@/components/data-table/DataTable';
import { ResponsiveContainer, XAxis, YAxis, Line, LineChart } from 'recharts';

interface Props {
  data: KeywordResultEntity[];
}
export const ResultResearchDataTable = ({ data }: Props) => {
  // --> ColumnDef

  const columns: ColumnDef<KeywordResultEntity>[] = [
    // KEYWORD
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      cell: ({ row }) => {
        const value = row.original.keyword ?? 'N/A';
        return <span className='font-medium'>{value}</span>;
      },
    },

    // COMPETITION
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

    // CPC
    {
      accessorKey: 'cpc',
      header: 'CPC',
      cell: ({ row }) => {
        const cpc = row.original.cpc;
        if (cpc == null) return <span>—</span>;
        return <span>${cpc.toFixed(2)}</span>;
      },
    },

    // SEARCH VOLUME
    {
      accessorKey: 'search_volume',
      header: 'Search Volume',
      cell: ({ row }) => {
        const vol = row.original.search_volume ?? 0;
        return <span className='font-semibold'>{vol}</span>;
      },
    },

    // BIDS (LOW / HIGH)
    {
      id: 'bids',
      header: 'Low / High Bid',
      cell: ({ row }) => {
        const low = row.original.low_top_of_page_bid;
        const high = row.original.high_top_of_page_bid;

        const getColor = (v?: number | null) => {
          if (v == null) return 'bg-gray-400/10 text-gray-500';
          if (v < 0.1) return 'bg-red-500/10 text-red-500';
          if (v < 0.5) return 'bg-orange-500/10 text-orange-500';
          return 'bg-green-500/10 text-green-500';
        };

        return (
          <div className='flex flex-col gap-1'>
            <Badge className={getColor(low)}>
              Low: {low == null ? '—' : `$${low.toFixed(2)}`}
            </Badge>

            <Badge className={getColor(high)}>
              High: {high == null ? '—' : `$${high.toFixed(2)}`}
            </Badge>
          </div>
        );
      },
    },

    // TREND (monthly_searches)

    {
      accessorKey: 'monthly_searches',
      header: 'Trend',
      cell: ({ row }) => {
        const monthly = row.original.monthly_searches;

        if (!monthly || monthly.length === 0) {
          return <span className='text-muted-foreground text-xs'>No data</span>;
        }

        const chartData = monthly.map((m) => ({
          month: m.month ? m.month : 1,
          value: m.search_volume,
          max: Math.max(m.search_volume),
          min: Math.min(m.search_volume),
        }));

        return (
          <ResponsiveContainer width={320} height={80}>
            <LineChart data={chartData}>
              <XAxis dataKey='month' tick={{ fontSize: 6 }} />
              <YAxis domain={['min', 'max']} tick={{ fontSize: 7 }} />
              <Line
                type='basis'
                dataKey='value'
                stroke='currentColor'
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      },
    },

    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => {
    //     const item = row.original;
    //     return (
    //       <ActionsButtonSet
    //         item={item}
    //         actions={[
    //           {
    //             icon: ChartArea,
    //             label: 'View Details',
    //             onClick: (item) => onShowChart(item),
    //           },
    //         ]}
    //       />
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
  ];

  // const columns: ColumnDef<KeywordResultEntity>[] = [
  //   {
  //     accessorKey: 'keyword',
  //     header: 'Keyword',
  //     cell: ({ row }) => {
  //       const value = row.getValue('keyword') as string;
  //       return <span className='font-medium'>{value}</span>;
  //     },
  //   },

  //   {
  //     accessorKey: 'competition',
  //     header: 'Competition',
  //     cell: ({ row }) => {
  //       const value = row.getValue('competition') as number;
  //       const badgeColor = getCompetitionColor(value);

  //       return (
  //         <Badge className={badgeColor}>{(value * 100).toFixed(0)}%</Badge>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: 'cpc',
  //     header: 'CPC',
  //     cell: ({ row }) => {
  //       const value: KeywordResultEntity['cpc'] = row.getValue('cpc');
  //       return <span>${value}</span>;
  //     },
  //   },

  //   {
  //     accessorKey: 'search_volume',
  //     header: 'Search Volume',
  //     cell: ({ row }) => {
  //       const value: KeywordResultEntity['search_volume'] =
  //         row.getValue('search_volume');
  //       return <span className='font-semibold'>{value}</span>;
  //     },
  //   },

  //   {
  //     id: 'bids',
  //     header: 'Low / High Bid',
  //     cell: ({ row }) => {
  //       const low: KeywordResultEntity['low_top_of_page_bid'] =
  //         row.getValue('low_top_of_page_bid') ?? 0;
  //       const high: KeywordResultEntity['high_top_of_page_bid'] =
  //         row.getValue('high_top_of_page_bid') ?? 0;

  //       const lowColor = getBidColor(low);
  //       const highColor = getBidColor(high);

  //       return (
  //         <div className='flex flex-col gap-1'>
  //           <Badge className={lowColor}>Low: ${low.toFixed(2)}</Badge>
  //           <Badge className={highColor}>High: ${high.toFixed(2)}</Badge>
  //         </div>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: 'monthly_searches',
  //     header: 'Trend',
  //     cell: ({ row }) => {
  //       const data = row.getValue('monthly_searches') as {
  //         month: string;
  //         value: number;
  //       }[];

  //       const readableData = data.map((d) => ({
  //         month: d.month.slice(0, 1).toUpperCase(),
  //         value: d.value,
  //       }));

  //       return (
  //         <ResponsiveContainer width={120} height={40}>
  //           <LineChart data={readableData}>
  //             <XAxis
  //               dataKey='month'
  //               hide={false}
  //               axisLine={false}
  //               tickLine={false}
  //               tick={{ fontSize: 10 }}
  //             />
  //             <Line
  //               type='monotone'
  //               dataKey='value'
  //               stroke='currentColor'
  //               strokeWidth={2}
  //               dot={false}
  //             />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: 'search_volume',
  //     header: 'Volume',
  //     cell: ({ row }) => {
  //       const value: KeywordResultEntity['search_volume'] =
  //         row.getValue('search_volume');
  //       return <span>{value}</span>;
  //     },
  //   },
  // ];
  return (
    <>
      <DataTable columns={columns} data={data} enableSelection />
    </>
  );
};
