// TODO:  Continuar

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import { KeywordResearchEntity, KeywordResultEntity } from '@/core/entities';

import { DataTable } from '@/components/data-table/DataTable';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import Image from 'next/image';
import { ActionsButtonSet } from '@/components/data-table/ActionsButtons';
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Eye,
  FileText,
  ListCheck,
  ListMinus,
  Save,
  SaveAll,
} from 'lucide-react';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { useEffect, useState } from 'react';
import { showToast } from '@/components/CustomToaster';
import { CustomLoading } from '@/components/CustomLoading';
import { useRouter } from 'next/navigation';
import { useKeywordStore } from './context/KeywordSelectionStore';
import { CustomTabTrigger } from '../../components';

interface Props {
  data: KeywordResultEntity[];
}
export const ResultResearchDataTable = ({ data }: Props) => {
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const router = useRouter();
  const setUnselect = useKeywordStore((st) => st.setUnSelec);
  const unSelected = useKeywordStore((st) => st.unSelect);
  const selectedResearch = useKeywordStore((st) => st.selectedResearch);

  const formatNumberAbbreviated = (num: number) => {
    const number = Number(num);
    if (isNaN(number) || number === 0) {
      return '0';
    }

    const suffixes = [
      { value: 1e12, symbol: 'T' },
      { value: 1e9, symbol: 'B' },
      { value: 1e6, symbol: 'M' },
      { value: 1e3, symbol: 'K' },
    ];

    const sign = Math.sign(number);
    const absNumber = Math.abs(number);
    const signPrefix = sign > 0 && absNumber >= 1000 ? '+' : '';

    for (let i = 0; i < suffixes.length; i++) {
      const { value, symbol } = suffixes[i];

      if (absNumber >= value) {
        const formatted = (absNumber / value).toFixed(1).replace(/\.0$/, '');

        return `${signPrefix}${formatted}${symbol}`;
      }
    }

    return number.toLocaleString('es-ES', { maximumFractionDigits: 0 });
  };

  // handlers

  const onShow = async (item: KeywordResultEntity) => {
    const REPO = new KeywordResearchApiRepository();
    try {
      setIsError('');
      setIsLoading(true);
      const response = await REPO.googleSearchWord(item.keyword);
      console.log('🧮', response);
      setImage(response);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : 'Error getting the Google Snap'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onExport = async () => {
    try {
      setIsLoadingDownload(true);
      const REPO = new KeywordResearchApiRepository();
      await REPO.exportExcel(selectedResearch);
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : 'Unexpected Error Downloading Report'
      );
    } finally {
      setIsLoadingDownload(false);
    }
  };

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error Getting Google Snap',
        description: isError,
        type: 'error',
      });
    }
    if (data.length === 0) {
      router.push('/tools/seo/keyword-research');
    }
  }, [isError, data]);

  // --> ColumnDef

  const columns: ColumnDef<KeywordResultEntity>[] = [
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      cell: ({ row }) => {
        const value = row.original.keyword ?? 'N/A';
        return <span className='font-medium'>{value}</span>;
      },
    },

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

    {
      accessorKey: 'search_volume',
      header: 'Search Volume',
      cell: ({ row }) => {
        const vol = row.original.search_volume ?? 0;

        const formattedVolume = formatNumberAbbreviated(vol);

        return <span className='font-semibold'>{formattedVolume}</span>;
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
                onClick: async (item) => {
                  console.log(item);
                  await onShow(item);
                },
              },

              {
                icon: ArrowRightCircle,
                label: 'Delete',
                onClick: () => {
                  setUnselect(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the discard list`,
                    type: 'success',
                  });
                },
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

  const columnsUnSelected: ColumnDef<KeywordResultEntity>[] = [
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      cell: ({ row }) => {
        const value = row.original.keyword ?? 'N/A';
        return <span className='font-medium'>{value}</span>;
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
                icon: ArrowLeftCircle,
                label: 'Delete',
                onClick: () => {
                  setUnselect(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the Positive Keywords list`,
                    type: 'success',
                  });
                },
              },
            ]}
            className='bg-green-500/10 text-green-500'
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <Tabs defaultValue='results'>
        <TabsList className='w-full container mx-auto max-w-7xl flex shrink-0 items-center justify-start lg:justify-center   p-0 mb-2 rounded-none overflow-x-auto snap-none md:snap-x md:snap-mandatory snap-always bg-transparent'>
          <CustomTabTrigger
            tab_value='results'
            icon={ListCheck}
            tab_name={`Result Research (${data.length})`}
          />
          <CustomTabTrigger
            tab_value='unSelected'
            icon={ListMinus}
            tab_name={`Discard Positive Words (${unSelected.length})`}
          />
        </TabsList>
        <TabsContent value='results'>
          <div className='grid md:grid-cols-2  gap-2'>
            <DataTable columns={columns} data={data} pageSize={100} />

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className='flex items-center gap-2'>
                    {' '}
                    <Image
                      src={'/logos/google.svg'}
                      alt='Google'
                      className='size-6'
                      width={128}
                      height={128}
                    />{' '}
                    <h2 className='texl-xl'>Google Snap</h2>
                  </div>
                </CardTitle>
                <CardContent className=' w-full min-h-64'>
                  {isLoading ? (
                    <div>
                      <CustomLoading message='Getting Google Snapshot' />
                    </div>
                  ) : (
                    <Image
                      src={
                        image.length === 0
                          ? '/placeholder.png'
                          : `data:image/jpeg;base64, ${image}`
                      }
                      alt={
                        image.length === 0 ? 'Placeholder Image' : 'Google Snap'
                      }
                      width={1920}
                      height={1080}
                      className='w-full rounded-md'
                      loading='eager'
                    />
                  )}
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='unSelected'>
          <DataTable
            columns={columnsUnSelected}
            data={unSelected}
            pageSize={100}
          />
        </TabsContent>
      </Tabs>
      <div className='h-12 p-2 bg-card border-t backdrop-blur-md w-full sticky bottom-0 flex items-center justify-end gap-6 '>
        <Button
          variant='secondary'
          className='w-48'
          onClick={() => onExport()}
          disabled={isLoadingDownload}
        >
          {isLoadingDownload ? (
            <CustomLoading message='Generating Report' />
          ) : (
            <>
              {' '}
              Download Report <FileText />{' '}
            </>
          )}
        </Button>
        <Button>
          Save <SaveAll />
        </Button>
      </div>
    </>
  );
};
