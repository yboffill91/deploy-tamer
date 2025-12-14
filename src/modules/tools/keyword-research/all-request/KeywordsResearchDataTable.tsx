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
  Loader2,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useResearchStore } from './context/ResearchStore';
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
import { CustomCard } from '@/components/CustomCard';

export const KeywordsResearchDataTable = ({
  onChangeTab,
}: {
  onChangeTab(): void;
}) => {
  const keywordsResearch = useResearchStore((st) => st.allResearch);
  const isLoading = useResearchStore((st) => st.isLoadingResearchs);
  const isError = useResearchStore((st) => st.isErrorGettingResearch);
  const getKeywordsResearch = useResearchStore((st) => st.getAllResearch);

  const setResultSelected = useKeywordStore((st) => st.setSelection);
  const setSelectedResearch = useKeywordStore((st) => st.setSelectedResearch);
  const selectedResearch = useKeywordStore((st) => st.selectedResearch);
  const setFormSelectedResearch = useFormStore((st) => st.getKeyWordResearch);
  const setFormMode = useFormStore((st) => st.setMode);
  const router = useRouter();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [componentError, setComponentError] = useState('');
  const [loadingDownload, setIsLoadingDownload] = useState(false);
  const [laodingDownloadURL, setIsLoadingDownloadURL] = useState(false);
  const [buttonsBussy, setButtonBussy] = useState<number>();
  const [fieldValue, setFiedValue] = useState('');

  const handleShowConfirm = (el: KeywordResearchEntity) => {
    setSelectedResearch(el);
    setShowDialog(!showDialog);
  };

  const handleEdit = (item: KeywordResearchEntity) => {
    setFormMode('edit');
    setFormSelectedResearch(String(item.id));
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
  const onExportURL = async (item: KeywordResearchEntity) => {
    try {
      setButtonBussy(item.id);
      setIsLoadingDownloadURL(true);
      const REPO = new KeywordResearchApiRepository();
      await REPO.exportExcelUrl(String(item.id));
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Downloading Report'
      );
    } finally {
      setIsLoadingDownloadURL(false);
      setButtonBussy(0);
    }
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
    setSelectedResearch(item);
    router.push('/tools/seo/keyword-result');
  };

  const onRun = async (id: string) => {
    const REPO = new KeywordResearchApiRepository();
    try {
      setButtonBussy(Number(id));
      setComponentError('');
      await REPO.runKeyword(id);
      getKeywordsResearch();
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Running Keyword Research'
      );
    } finally {
      setButtonBussy(0);
    }
  };

  const onFinish = async (id: string) => {
    try {
      setButtonBussy(Number(id));
      const REPO = new KeywordResearchApiRepository();
      await REPO.forceEnd(id);
      getKeywordsResearch();
    } catch (error) {
      setComponentError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while finishing the keyword research.'
      );
    } finally {
      setButtonBussy(null);
    }
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
      header: 'Result',
      cell: ({ row }) => {
        const value: KeywordResearchEntity['result'] = row.getValue('result');
        return value && value.length > 0 ? (
          <Badge className='bg-green-500/10 dark:text-green-500 text-green-700'>
            <Check />
          </Badge>
        ) : (
          <Badge className='bg-destructive/10 text-destructive'> - </Badge>
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
        return value === 0 ? '-' : value;
      },
    },
    {
      id: 'actions',
      header: () => (
        <span className=' w-full flex items-center justify-end'> Actions </span>
      ),
      cell: ({ row }) => {
        const item = row.original;
        console.log(item);
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
                        item.status === KeywordStatus.READY_TO_CHECK,
                    },
                    {
                      icon: Eye,
                      label: 'Review the result',
                      onClick: onShow,
                      show: (item) =>
                        item.status === KeywordStatus.READY_TO_CHECK ||
                        item.status === KeywordStatus.FINISHED,
                    },
                    {
                      icon: FileText,
                      label: 'Download results report (Excel)',
                      onClick: onExport,
                      show: (item) => item.status === KeywordStatus.FINISHED,
                    },
                    {
                      icon: Link,
                      label: 'Download the Organic URL report.',
                      onClick: onExportURL,
                      variant: 'ghost',
                      show: (item) => item.status === KeywordStatus.FINISHED,
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
      {Array.isArray(keywordsResearch) &&
        keywordsResearch.length > 0 &&
        !isLoading && (
          <>
            <DataTable
              data={keywordsResearch}
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
                Please confirm that you wish to delete Keyword Research; this
                step will be irreversible and your used credits will be
                consumed.
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
      {(loadingDownload || laodingDownloadURL) && (
        <div className='w-full h-screen bg-background/90 flex items-center justify-center fixed top-0 left-0 z-50'>
          <CustomLoading message='Generating Report' />
        </div>
      )}
      {!isLoading &&
        (!Array.isArray(keywordsResearch) ||
          keywordsResearch.length === 0 ||
          !keywordsResearch) && (
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
