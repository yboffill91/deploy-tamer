'use client';

import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';
import { DataTable } from '@/components/data-table/DataTable';
import { Badge } from '@/components/ui';
import { KeywordResearchEntity } from '@/core/entities';
import { cn } from '@/lib/utils';
import { CommonHeader } from '@/modules/users/admin';
import { ColumnDef } from '@tanstack/react-table';
import { List } from 'lucide-react';
import { useEffect } from 'react';
import { useResearchStore } from './context/ResearchStore';

export const KeywordsResearchDataTable = () => {
  const keywordsResearch = useResearchStore((st) => st.allResearch);
  const isLoading = useResearchStore((st) => st.isLoadingResearchs);
  const isError = useResearchStore((st) => st.isErrorGettingResearch);
  const getKeywordsResearch = useResearchStore((st) => st.getAllResearch);

  useEffect(() => {
    getKeywordsResearch();
  }, [getKeywordsResearch]);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error getting Keyword Research List',
        description: isError,
        type: 'error',
      });
    }
  }, [isError]);

  console.log(keywordsResearch);

  // ---> Columns Defs

  const columns: ColumnDef<KeywordResearchEntity>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'positiveKeywords',
      header: 'Positive KW',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['positiveKeywords'] =
          row.getValue('positiveKeywords');
        return value.length === 0
          ? 'No Positive Kywords'
          : value.slice(0, 3).map((item, index) => (
              <Badge key={index} variant='secondary' className='mx-1'>
                {item}
              </Badge>
            ));
      },
    },
    {
      accessorKey: 'negativeKeywords',
      header: 'Negative KW',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['negativeKeywords'] =
          row.getValue('negativeKeywords');
        return Object.entries(value).length === 0
          ? 'No Negative Keywords'
          : Object.entries(value).map((item, index) => (
              <Badge key={index}>
                {index === 3 ? `... ${value.length - 3} more` : item}
              </Badge>
            ));
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['status'] = row.getValue('status');

        return <StatusBadge value={value} />;
      },
    },
    {
      accessorKey: 'type',
      header: 'Research Type',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['type'] = row.getValue('type');
        return <TypeBadge value={value} />;
      },
    },
    {
      accessorKey: 'searchVolume',
      header: 'Volume of Search',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['searchVolume'] =
          row.getValue('searchVolume');
        return value === 0 ? 'No Volume Search' : value;
      },
    },
  ];

  return (
    <>
      <CommonHeader
        icon={List}
        desc='All Keyword Researchs'
        title='Keyword Researchs'
      />
      {isLoading && !keywordsResearch && (
        <CustomPageLoader message='Getting Keywords Research' />
      )}
      {keywordsResearch && keywordsResearch.length > 0 && !isLoading && (
        <DataTable data={keywordsResearch} columns={columns} />
      )}
    </>
  );
};

const StatusBadge = ({ value }: { value: KeywordResearchEntity['status'] }) => {
  return (
    <Badge
      className={cn(
        value === 'CREATED' &&
          'bg-green-500/10 dark:text-green-500 text-green-700',
        value === 'IN_PROGRESS' &&
          'bg-orange-500/10 dark:text-orange-500 text-orange-700'
      )}
    >
      {value.replace('_', ' ')}
    </Badge>
  );
};

const TypeBadge = ({ value }: { value: KeywordResearchEntity['type'] }) => {
  return (
    <Badge
      className={cn(
        value === 'TRANSACTIONAL' &&
          'bg-green-500/10 dark:text-green-500 text-green-700',
        value === 'INFORMATIONAL' &&
          'bg-orange-500/10 dark:text-orange-500 text-orange-700'
      )}
    >
      {value.replace('_', ' ')}
    </Badge>
  );
};
