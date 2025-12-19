'use client';

import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';
import { DataTable } from '@/components/data-table/DataTable';
import {
  Badge,
  Button,
  Card,
  InputGroup,
  InputGroupInput,
} from '@/components/ui';
import { KeywordResearchEntity, KeywordStatus } from '@/core/entities';
import { CommonHeader } from '@/modules/users/admin';
import { ColumnDef } from '@tanstack/react-table';
import {
  Check,
  Eye,
  FileText,
  Goal,
  Link,
  List,
  Minus,
  Pencil,
  Play,
  PlayCircle,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActionsButtonSet } from '@/components/data-table/ActionsButtons';
import { TypeBadge } from './TypesBadge';
import { useKeywordStore } from './context/KeywordSelectionStore';
import { useRouter } from 'next/navigation';
import { RotatingBadge } from '@/components/RotatingBadge';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CustomLoading } from '@/components/CustomLoading';
import { useFormStore } from '../context/FormStore';
import { StatusBadge } from '../components/StatusBadge';
import { CustomEmpty } from '@/components/CustomEmpty';

import {
  useKeywordResearchList,
  useDeleteKeywordResearch,
  useRunKeywordResearch,
  useForceEndKeywordResearch,
} from '@/modules/tools/keyword-research/hooks';

export const KeywordsResearchDataTable = ({
  onChangeTab,
}: {
  onChangeTab(): void;
}) => {
  const {
    data: keywordResearch,
    isLoading,
    error,
    refetch,
  } = useKeywordResearchList();
  const deleteMutation = useDeleteKeywordResearch();
  const runMutation = useRunKeywordResearch();
  const forceEndMutation = useForceEndKeywordResearch();

  const setResultSelected = useKeywordStore((st) => st.setSelection);
  const setSelectedResearch = useKeywordStore((st) => st.setSelectedResearch);
  const selectedResearch = useKeywordStore((st) => st.selectedResearch);
  const setFormSelectedResearch = useFormStore((st) => st.getKeyWordResearch);
  const setFormMode = useFormStore((st) => st.setMode);
  const router = useRouter();

  const [showDialog, setShowDialog] = useState(false);
  const [componentError, setComponentError] = useState('');
  const [loadingDownload, setIsLoadingDownload] = useState(false);
  const [buttonsBussy, setButtonBussy] = useState<number>();
  const [fieldValue, setFiedValue] = useState('');

  const handleShowConfirm = (el: KeywordResearchEntity) => {
    setSelectedResearch(el);
    setShowDialog(!showDialog);
  };

  const handleEdit = (item: KeywordResearchEntity) => {
    setFormSelectedResearch(String(item.id));
    setFormMode('edit');
    onChangeTab();
    router.push('/tools/seo/keyword-research');
  };
  const onExport = async (item: KeywordResearchEntity) => {
    try {
      setButtonBussy(item.id);
      setIsLoadingDownload(true);
      const REPO = new KeywordResearchApiRepository();
      await REPO.exportExcel(String(item.id));
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Downloading Report'
      );
    } finally {
      setIsLoadingDownload(false);
      setButtonBussy(0);
    }
  };
  const onRunURL = async (item: KeywordResearchEntity) => {
    try {
      setButtonBussy(item.id);
      const REPO = new KeywordResearchApiRepository();
      await REPO.executeFindUrl(String(item.id));
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Generating Report'
      );
    } finally {
      setButtonBussy(0);
    }
  };

  const onExportURL = async (item: KeywordResearchEntity) => {
    try {
      setButtonBussy(item.id);
      const REPO = new KeywordResearchApiRepository();
      await REPO.exportExcelUrl(String(item.id));
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Downloading Report'
      );
    } finally {
      setButtonBussy(0);
    }
  };

  const onConfirm = (id: string) => {
    setShowDialog(false);
    setComponentError('');

    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast({
          message: 'Keyword Research Deleted',
          description: 'The Keyword Research was successfully removed',
          type: 'success',
        });
      },
      onError: (error) => {
        setComponentError(
          error instanceof Error
            ? error.message
            : 'Unexpected Error deleting the keyword research'
        );
      },
    });
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        message: 'Error getting Keyword Research List',
        description:
          error instanceof Error ? error.message : 'Unexpected Error',
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
  }, [error, componentError]);

  const onShow = (item: KeywordResearchEntity) => {
    setResultSelected(item.result!);
    setSelectedResearch(item);
    router.push('/tools/seo/keyword-result');
  };

  const onRun = (id: string) => {
    setButtonBussy(Number(id));
    setComponentError('');

    runMutation.mutate(id, {
      onError: (error) => {
        setComponentError(
          error instanceof Error
            ? error.message
            : 'Unexpected Error Running Keyword Research'
        );
      },
      onSettled: () => {
        setButtonBussy(0);
      },
    });
  };

  const onFinish = (id: string) => {
    setButtonBussy(Number(id));

    forceEndMutation.mutate(id, {
      onError: (error) => {
        setComponentError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while finishing the keyword research.'
        );
      },
      onSettled: () => {
        setButtonBussy(0);
      },
    });
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
            <Minus className='text-destructive' />
          </Badge>
        ) : (
          <RotatingBadge items={arr} />
        );
      },
    },
   

    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['status'] = row.getValue('status');

        return <StatusBadge status={value} />;
      },
    },
  
    {
      id: 'actions',
      header: () => (
        <span className=' w-full flex items-center justify-end'> Actions </span>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            <>
              {item.status !== KeywordStatus.KEYWORING && (
                <ActionsButtonSet
                  item={item}
                  bussy={buttonsBussy === item.id}
                  actions={[
                    {
                      icon: Play,
                      label: 'Perform keyword research',
                      onClick: async () => {
                        onRun(String(item.id));
                      },
                      variant: 'ghost',
                      show: (item) => item.status === KeywordStatus.DRAFT,
                    },
                    {
                      icon: Goal,
                      label: 'Finish Keyword Research',
                      onClick: () => onFinish(String(item.id)),
                      show: (item) =>
                        item.status === KeywordStatus.READY_TO_CHECK ||
                        item.status === KeywordStatus.ORGANIC_FINISHED,
                    },
                    {
                      icon: Eye,
                      label: 'Review the result',
                      onClick: onShow,
                      show: (item) =>
                        item.status === KeywordStatus.READY_TO_CHECK ||
                        item.status === KeywordStatus.FINISHED ||
                        item.status === KeywordStatus.ORGANIC_FINISHED,
                    },
                    {
                      icon: FileText,
                      label: 'Download results report (Excel)',
                      onClick: onExport,
                      show: (item) =>
                        item.status === KeywordStatus.FINISHED ||
                        item.status === KeywordStatus.ORGANIC_FINISHED,
                    },
                    {
                      icon: PlayCircle,
                      label: 'Generate the Organic URL report.',
                      onClick: onRunURL,
                      variant: 'ghost',
                      show: (item) => item.status === KeywordStatus.FINISHED,
                    },
                    {
                      icon: Link,
                      label: 'Download the Organic URL report.',
                      onClick: onExportURL,
                      variant: 'ghost',
                      show: (item) =>
                        item.status === KeywordStatus.ORGANIC_FINISHED,
                    },

                    {
                      icon: Pencil,
                      label: 'Edit the Keyword Research Form',
                      onClick: () => handleEdit(item),
                      show: (item) =>
                        item.status === KeywordStatus.DRAFT ||
                        item.status === KeywordStatus.READY_TO_CHECK,
                    },

                    {
                      icon: Trash2,
                      label: 'Eliminate keyword research',
                      onClick: () => handleShowConfirm(item),
                      variant: 'ghostDestructive',
                    },
                  ]}
                />
              )}
            </>
          </>
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
      {isLoading && (
        <CustomPageLoader message='Obtaining the list of keyword research results.' />
      )}
      {Array.isArray(keywordResearch) &&
        keywordResearch.length > 0 &&
        !isLoading && (
          <>
            <DataTable
              data={keywordResearch}
              columns={columns}
              onAdd={() => {
                setFormMode('create');
                onChangeTab();
                router.push('/tools/seo/keyword-research');
              }}
            />
            <ControlledDialog
              open={showDialog}
              onOpenChange={() => {
                setFiedValue('');
                setShowDialog(!showDialog);
              }}
              title='Confirm deletion of keyword research'
            >
              <h3>
                Please confirm that you want to delete the Keyword Research.
                This step will be irreversible.
              </h3>
              <div className='flex gap-2 flex-col mt-4 text-sm text-muted-foreground bg-muted/30  p-4 rounded-md'>
                <h4>
                  To confirm, please enter the keyword research title in the
                  field below. ( {selectedResearch.title} )
                </h4>
                <InputGroup>
                  <InputGroupInput
                    placeholder='Write the title here'
                    value={fieldValue}
                    onChange={(e) => {
                      e.preventDefault();
                      setFiedValue(e.target.value);
                    }}
                    className='ring-none focus:ting-none'
                  ></InputGroupInput>
                </InputGroup>
              </div>
              <div className=' mt-4 w-full grid grid-cols-2 gap-2 p-2'>
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    setShowDialog(false);
                    setFiedValue('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => {
                    setFiedValue('');
                    onConfirm(String(selectedResearch.id));
                  }}
                  disabled={fieldValue !== selectedResearch.title}
                >
                  {' '}
                  <Trash2 />
                  Confirm
                </Button>
              </div>
            </ControlledDialog>
          </>
        )}
      {loadingDownload && (
        <div className='w-full h-screen bg-background/90 flex items-center justify-center fixed top-0 left-0 z-50'>
          <CustomLoading message='Generating Report' />
        </div>
      )}
      {!isLoading &&
        (!Array.isArray(keywordResearch) ||
          keywordResearch.length === 0 ||
          !keywordResearch) && (
          <Card className='mx-auto container max-w-2xl'>
            <CustomEmpty
              icon={List}
              description='You can start by creating the first clicking de add buttin bellow'
              title='No Keyword Research Created Yet'
              onClick={() => {
                setFormMode('create');
                onChangeTab();
                router.push('/tools/seo/keyword-research');
              }}
            />
          </Card>
        )}
    </>
  );
};
