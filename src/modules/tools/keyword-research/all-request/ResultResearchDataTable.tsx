import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import {
  KeywordResearchEntity,
  KeywordResultEntity,
  KeywordStatus,
} from '@/core/entities';

import { DataTable } from '@/components/data-table/DataTable';
import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Tabs,
  TabsContent,
  TabsList,
} from '@/components/ui';
import Image from 'next/image';
import { ActionsButtonSet } from '@/components/data-table/ActionsButtons';
import {
  ArrowLeftCircle,
  CircleMinusIcon,
  Columns2,
  Eye,
  FileWarning,
  Goal,
  ListCheck,
  ListFilter,
  ListMinus,
  ListPlus,
  PanelLeft,
  PanelRight,
  Plus,
  PlusCircle,
  Save,
  SaveAll,
  SendToBack,
} from 'lucide-react';
import { KeywordResearchApiRepository } from '@/infrastructure/repositories';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '@/components/CustomToaster';
import { CustomLoading } from '@/components/CustomLoading';
import { useRouter } from 'next/navigation';
import { useKeywordStore } from './context/KeywordSelectionStore';
import { CustomTabTrigger } from '../../components';
import { CreateKeywordResearchDTO } from '@/core/dto';
import { useFormStore } from '../context/FormStore';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { Separator } from 'radix-ui';
import { LoadingBase } from '@/components/LoadingBase';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CustomWordsComponent } from '../components';
import { useNegativeListStore } from '../context/WordsStoreFactory';

interface Props {
  data: KeywordResultEntity[];
}
export const ResultResearchDataTable = ({ data }: Props) => {
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [openNegativeList, setOpenNegativeList] = useState(false);

  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const [keyword, setKeyword] = useState('');

  const setFormMode = useFormStore((st) => st.setMode);
  const setFormSelectedResearch = useFormStore((st) => st.getKeyWordResearch);

  const setUnselect = useKeywordStore((st) => st.setUnSelec);
  const unSelected = useKeywordStore((st) => st.unSelect);
  const selectedResearch = useKeywordStore((st) => st.selectedResearch);
  const positivesToNewKeyword = useKeywordStore(
    (st) => st.positivesToNewKeyword
  );
  const setPositivesToNewKeyword = useKeywordStore(
    (st) => st.setPositiveToNewKeyword
  );
  const unselectPositivesToNewKeyword = useKeywordStore(
    (st) => st.setUnselectPositiveToKeyword
  );
  const selection = useKeywordStore((st) => st.selection);
  const hidrateDiscards = useKeywordStore((st) => st.hidrateUnSelect);
  const hidratePositiveToNewKeyword = useKeywordStore(
    (st) => st.hidratePositiveToNewKeyword
  );
  const negativeListWords = useNegativeListStore((st) => st.words);
  const addNegativeListWords = useNegativeListStore((st) => st.addWord);
  const deleteNegativeListWords = useNegativeListStore((st) => st.deleteWord);

  const router = useRouter();

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

  const onShow = async (item: KeywordResultEntity) => {
    const REPO = new KeywordResearchApiRepository();
    try {
      setIsError('');
      setIsLoading(true);
      const response = await REPO.googleSearchWord(item.keyword);
      setImage(response);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : 'Error getting the Google Snap'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async (selected: KeywordResearchEntity) => {
    try {
      setIsLoadingSave(true);
      setIsError('');
      const REPO = new KeywordResearchApiRepository();
      const payload: Partial<CreateKeywordResearchDTO> = {
        title: selected.title,
        allCitys: selected.allCitys,
        brand: selected.brand,
        city: selected.city,
        companyId: selected.companyId,
        extraPositiveKeywords: selected.extraPositiveKeywords,
        negativeKeywords: selected.negativeKeywords,
        region: selected.region,
        requestLanguage: selected.requestLanguage,
        searchVolume: selected.searchVolume,
        type: selected.type,
        positiveKeywords: selection.map((el) => el.keyword),
        generatedNegativeKeywords: unSelected, //TODO: Cambiar en el backend a una nueva tabla de discards
        generatedPositiveKeywords: positivesToNewKeyword, //TODO: Cambiar en el backend a una nueva tabla de palabras seleccionadas para correr un nuevo research
      };

      await REPO.update(String(selected.id), payload);
      showToast({
        message: 'Updated Successfully',
        description: 'The Keyword Research was successfully updated',
        type: 'success',
      });
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : 'Error updating the keyword research'
      );
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleEdit = async (item: KeywordResearchEntity) => {
    await onSave(item);
    setFormMode('create');
    setFormSelectedResearch(String(item.id));
    router.push('/tools/seo/keyword-research');
  };

  useEffect(() => {
    const hidrateDiscardsFromData = selectedResearch.generatedNegativeKeywords;
    const hidratePositivesNewResearch =
      selectedResearch.generatedPositiveKeywords;
    if (Array.isArray(hidrateDiscardsFromData)) {
      hidrateDiscards(hidrateDiscardsFromData);
    }

    if (Array.isArray(hidratePositivesNewResearch)) {
      hidratePositiveToNewKeyword(hidratePositivesNewResearch);
    }
    const hidrate = () => {};
    hidrate();
  }, []);
  const exactExclusions = new Set([
    ...unSelected.map((el) => el.keyword),
    ...positivesToNewKeyword.map((el) => el.keyword),
  ]);

  const normalizedNegativeWords = negativeListWords.map((word) =>
    word.toLowerCase().trim()
  );

  const dataToShow = data.filter((el) => {
    const keyword = el.keyword.toLowerCase();

    if (exactExclusions.has(el.keyword)) {
      return false;
    }

    const hasNegativeMatch = normalizedNegativeWords.some((neg) =>
      keyword.includes(neg)
    );

    if (hasNegativeMatch) {
      return false;
    }

    return true;
  });

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
  }, [isError, data, router]);

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
      header: () => (
        <div className='flex items-center w-full justify-center'>Actions</div>
      ),

      cell: ({ row }) => {
        const item = row.original;
        return (
          <ActionsButtonSet
            item={item}
            showRow={true}
            actions={[
              {
                icon: Eye,
                label: 'See Google screenshot',
                onClick: async (item) => {
                  await onShow(item);
                },
              },
              {
                icon: PlusCircle,
                label: 'Add to generate new keyword research',
                onClick: () => {
                  setPositivesToNewKeyword(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the Run New Research Keyword list`,
                    type: 'success',
                  });
                },
                show: () =>
                  selectedResearch.status === KeywordStatus.READY_TO_CHECK,
              },

              {
                icon: CircleMinusIcon,
                label: 'Add to Discard List',
                onClick: () => {
                  setUnselect(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the discard list`,
                    type: 'success',
                  });
                },
                show: () =>
                  selectedResearch.status === KeywordStatus.READY_TO_CHECK,
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
            showRow={true}
            actions={[
              {
                icon: ArrowLeftCircle,
                label: 'Send Back to Result List',
                onClick: () => {
                  setUnselect(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the Positive Keywords list`,
                    type: 'success',
                  });
                },
                variant: 'success',
              },
            ]}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const columnsPositiveToNewKeyword: ColumnDef<KeywordResultEntity>[] = [
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
            showRow={true}
            actions={[
              {
                icon: ArrowLeftCircle,
                label: 'Back to the positive keywords',
                onClick: () => {
                  unselectPositivesToNewKeyword(item);
                  showToast({
                    message: 'Successfully moved',
                    description: `${item.keyword} It was correctly moved to the Positive Keywords list`,
                    type: 'success',
                  });
                },
                variant: 'success',
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
    <div className='relative'>
      <Tabs defaultValue='results'>
        <TabsList className='w-full container mx-auto max-w-7xl flex shrink-0 items-center justify-start lg:justify-center   p-0 mb-8 rounded-none overflow-x-auto snap-none md:snap-x md:snap-mandatory snap-always bg-transparent'>
          <CustomTabTrigger
            tab_value='results'
            icon={ListCheck}
            tab_name={`Result Research (${dataToShow.length})`}
          />
          {unSelected.length > 0 && (
            <CustomTabTrigger
              tab_value='unSelected'
              icon={ListMinus}
              tab_name={`Discard Positive Words (${unSelected.length})`}
            />
          )}
          {positivesToNewKeyword.length > 0 && (
            <CustomTabTrigger
              tab_value='positivesToNewKeywordResearch'
              icon={ListPlus}
              tab_name={`Run New KeywordResearch Research (${positivesToNewKeyword.length})`}
            />
          )}
        </TabsList>
        <TabsContent value='results'>
          <div className='flex flex-col gap-2'>
            <div className='w-full flex justify-between bg-muted/20 rounded'>
              <ButtonGroup>
                <ButtonGroupText>Save & Run</ButtonGroupText>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => onSave(selectedResearch)}
                  aria-label='Save'
                >
                  {isLoadingSave ? (
                    <>
                      <LoadingBase />
                    </>
                  ) : (
                    <>
                      <SaveAll />
                    </>
                  )}
                </Button>
                <ButtonGroupSeparator />
                <Button
                  size='icon'
                  variant='outline'
                  disabled={positivesToNewKeyword.length === 0}
                  aria-label='Run New Keyword'
                  onClick={() => handleEdit(selectedResearch)}
                >
                  <Goal />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  variant={'outline'}
                  size='icon'
                  onClick={() => {
                    leftPanelRef.current.collapse();
                    rightPanelRef.current.resize(100);
                  }}
                >
                  <PanelLeft />
                </Button>
                <ButtonGroupSeparator />
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    leftPanelRef.current.resize(50);
                    rightPanelRef.current.resize(50);
                  }}
                >
                  <Columns2 />
                </Button>
                <ButtonGroupSeparator />

                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    leftPanelRef.current.resize(100);
                    rightPanelRef.current.collapse();
                  }}
                >
                  <PanelRight />
                </Button>
              </ButtonGroup>

              <ButtonGroup>
                <ButtonGroupText>Negative List</ButtonGroupText>

                <Button
                  variant='outline'
                  onClick={() => setOpenNegativeList(!openNegativeList)}
                >
                  <ListFilter />
                </Button>
              </ButtonGroup>
            </div>
            <ResizablePanelGroup
              direction='horizontal'
              className='border rounded-2xl'
            >
              <ResizablePanel
                ref={leftPanelRef}
                defaultSize={50}
                className='p-2'
              >
                <DataTable
                  columns={columns}
                  data={dataToShow}
                  pageSize={100}
                  persistKey='result-data'
                />
              </ResizablePanel>

              <ResizableHandle className='bg-accent' />

              <ResizablePanel
                ref={rightPanelRef}
                defaultSize={50}
                className='p-2'
              >
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
                        <>
                          {image && (
                            <Image
                              src={`data:image/jpeg; base64, ${image}`}
                              width={4800}
                              height={8600}
                              alt='Google Snapshot'
                              className='w-full rounded-lg'
                            ></Image>
                          )}
                        </>
                      )}
                    </CardContent>
                  </CardHeader>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </TabsContent>
        <TabsContent value='unSelected'>
          <DataTable
            columns={columnsUnSelected}
            data={unSelected}
            pageSize={100}
          />
        </TabsContent>
        <TabsContent value='positivesToNewKeywordResearch'>
          <DataTable
            columns={columnsPositiveToNewKeyword}
            data={positivesToNewKeyword}
            pageSize={100}
          />
        </TabsContent>
      </Tabs>
      <ControlledDialog
        open={openNegativeList}
        onOpenChange={setOpenNegativeList}
        title='Negative List'
      >
        <CustomWordsComponent
          list={negativeListWords}
          emptyMessageWorldsContainer='No negative words filter added'
          inputHandleOnClick={() => addNegativeListWords(keyword)}
          inputOnChangeValue={(e) => setKeyword(e.target.value)}
          inputValue={keyword}
          onDeleteWorldsContainer={deleteNegativeListWords}
        />
      </ControlledDialog>
    </div>
  );
};
