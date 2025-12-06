'use client';

import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';
import { DataTable } from '@/components/data-table/DataTable';
import { Badge, Button } from '@/components/ui';
import {
  KeywordAnnotationEntity,
  KeywordResearchEntity,
} from '@/core/entities';
import { CommonHeader } from '@/modules/users/admin';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, List, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useResearchStore } from './context/ResearchStore';
import { ActionsButtonSet } from '@/components/data-table/ActionsButtons';
import { TypeBadge } from './TypesBadge';
import { StatusBadge } from './StatusBadge';
import { useKeywordStore } from './context/KeywordSelectionStore';
import { useRouter } from 'next/navigation';
import { RotatingBadge } from '@/components/RotatingBadge';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CustomLoading } from '@/components/CustomLoading';

export const KeywordsResearchDataTable = () => {
  const keywordsResearch = useResearchStore((st) => st.allResearch);
  const isLoading = useResearchStore((st) => st.isLoadingResearchs);
  const isError = useResearchStore((st) => st.isErrorGettingResearch);
  const getKeywordsResearch = useResearchStore((st) => st.getAllResearch);

  const setResultSelected = useKeywordStore((st) => st.setSelection);
  const setSelectedResearch = useKeywordStore((st) => st.setSelectedResearch);
  const selectedResearch = useKeywordStore((st) => st.selectedResearch);
  const router = useRouter();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [componentError, setComponentError] = useState('');

  const handleShowConfirm = (el: KeywordResearchEntity) => {
    setSelectedResearch(String(el.id));
    setShowDialog(!showDialog);
  };

  const onConfirm = async (id: string) => {
    const REPO = new KeywordResearchApiRepository();
    try {
      setConfirmLoading(true);
      setComponentError('');
      await REPO.delete(id);
      getKeywordsResearch();
      showToast({
        message: 'Keyword Research Deleted',
        description: 'The Keyword Research was successfully removed',
        type: 'success',
      });
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error deleting the keyword research'
      );
    } finally {
      setShowDialog(false);
      setConfirmLoading(false);
    }
  };

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
    if (componentError) {
      showToast({
        message: 'Error',
        description: componentError,
        type: 'error',
      });
    }
  }, [isError, componentError]);

  const onShow = (item: KeywordResearchEntity) => {
    setResultSelected(item.result!);
    setSelectedResearch(String(item.id));
    router.push('/tools/seo/keyword-result');
  };

  const columns: ColumnDef<KeywordResearchEntity>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      enableHiding: false,
    },
    {
      accessorKey: 'positiveKeywords',
      header: 'Positive KW',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['positiveKeywords'] =
          row.getValue('positiveKeywords');
        return value.length === 0 ? (
          <Badge
            variant='secondary'
            className='bg-transparent! text-muted-foreground'
          >
            {' '}
            No Positive Kywords
          </Badge>
        ) : (
          <RotatingBadge items={value} />
        );
      },
    },
    {
      accessorKey: 'negativeKeywords',
      header: 'Negative KW',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['negativeKeywords'] =
          row.getValue('negativeKeywords');
        const arr = Object.entries(value).map(([_, val]) => val);
        return arr.length === 0 ? (
          <Badge
            variant='destructive'
            className='bg-transparent! text-muted-foreground'
          >
            No Negative Keywords
          </Badge>
        ) : (
          <RotatingBadge items={arr} />
        );
      },
    },
    {
      accessorKey: 'region',
      header: 'Regions',
      cell: ({ row }) => {
        const values: KeywordResearchEntity['region'] = row.getValue('region');
        return Array.isArray(values) && values.length > 1 ? (
          <RotatingBadge items={values} />
        ) : (
          <span>{values}</span>
        );
      },
    },
    {
      accessorKey: 'result',
      header: 'Has Result',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['result'] = row.getValue('result');
        return value && value.length > 0 ? (
          <Badge className='bg-green-500/10 dark:text-green-500 text-green-700'>
            Yes
          </Badge>
        ) : (
          <Badge className='bg-destructive/10 text-destructive'>No</Badge>
        );
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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <ActionsButtonSet
            item={item}
            actions={[
              {
                icon: Eye,
                label: 'View Details',
                onClick: onShow,
                show: (item) => Array.isArray(item.result),
              },
              {
                icon: Pencil,
                label: 'Edit',
                onClick: () => console.log(item),
              },
              {
                icon: Trash2,
                label: 'Delete',
                onClick: () => handleShowConfirm(item),
                variant: 'destructive',
              },
            ]}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <CommonHeader
        icon={List}
        desc='All Keyword Researchs'
        title='Keyword Researchs'
      />
      {isLoading && <CustomPageLoader message='Getting Keywords Research' />}
      {keywordsResearch && !isLoading && (
        <>
          <DataTable
            data={keywordsResearch}
            columns={columns}
            onAdd={() => console.log('Add')}
          />
          <ControlledDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            title='Confirm Delete Keyword Research'
          >
            <h3>
              Please confirm that you wish to remove the Keyword Research; this
              action will be irreversible.
            </h3>
            <div className=' mt-4 w-full grid grid-cols-2 gap-2 p-2'>
              <Button
                variant={'secondary'}
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() => onConfirm(selectedResearch)}
              >
                {confirmLoading ? (
                  <CustomLoading message='Deleting Keyword Research' />
                ) : (
                  <>
                    {' '}
                    <Trash2 />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </ControlledDialog>
        </>
      )}
      {/* {!isLoading && (keywordsResearch.length === 0 || !keywordsResearch) && (
        <div>Empty</div>
      )} */}
    </>
  );
};
