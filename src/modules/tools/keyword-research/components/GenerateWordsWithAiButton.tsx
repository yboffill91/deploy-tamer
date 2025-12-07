'use client';
import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  SheetClose,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from '../context/WordsStoreFactory';
import { CustomLoading } from '@/components/CustomLoading';
import { Bot, Check, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { CreateSuggestDTO } from '@/core/dto';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/CustomToaster';
import { CustomSheet } from '@/components/CustomSheet';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { useState } from 'react';

interface Props {
  isLoading: boolean;
  type: 'Positive Words' | 'Negative Words' | 'Extra Positive Words' | 'Brands';
}

export const GenerateWordsWithAiButton = ({ isLoading, type }: Props) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const addWords = usePositiveStore((st) => st.addWord);
  const addNegative = useNegativeStore((st) => st.addWord);
  const addExtra = useExtraPositiveStore((st) => st.addWord);
  const addBrand = useBrandStore((st) => st.addWord);

  const deleteWords = usePositiveStore((st) => st.deleteWord);
  const deleteNegative = useNegativeStore((st) => st.deleteWord);
  const deleteExtra = useExtraPositiveStore((st) => st.deleteWord);
  const deleteBrand = useBrandStore((st) => st.deleteWord);

  const suggestedWords = usePositiveStore((st) => st.sugguestedWords);
  const suggestedNegative = useNegativeStore((st) => st.sugguestedWords);
  const suggestedExtra = useExtraPositiveStore((st) => st.sugguestedWords);
  const suggestedBrands = useBrandStore((st) => st.sugguestedWords);

  const clearSuggestedWords = usePositiveStore((st) => st.clearSuggestedWords);
  const clearSuggestedNegative = useNegativeStore(
    (st) => st.clearSuggestedWords
  );
  const clearSuggestedExtra = useExtraPositiveStore(
    (st) => st.clearSuggestedWords
  );
  const clearSuggestedBrands = useBrandStore((st) => st.clearSuggestedWords);

  const words = usePositiveStore((st) => st.words);
  const negative = useNegativeStore((st) => st.words);
  const extra = useExtraPositiveStore((st) => st.words);
  const brands = useBrandStore((st) => st.words);

  const getSuggestedPositiveWords = usePositiveStore(
    (st) => st.getSuggestedWords
  );
  const getSuggestedBrands = useBrandStore((st) => st.getSuggestedWords);
  const getSuggestedNegativeWords = useNegativeStore(
    (st) => st.getSuggestedWords
  );
  const getSuggestedExtraPositiveWords = useExtraPositiveStore(
    (st) => st.getSuggestedWords
  );

  const clickHandler = () => {
    const payLoad = new CreateSuggestDTO(words);
    if (type === 'Brands') {
      getSuggestedBrands(payLoad);
    }
    if (type === 'Extra Positive Words') {
      getSuggestedExtraPositiveWords(payLoad);
    }
    if (type === 'Negative Words') {
      getSuggestedNegativeWords(payLoad);
    }
    if (type === 'Positive Words') {
      getSuggestedPositiveWords(payLoad);
    }
    setShowNotification(true);
  };

  const handleAdd = (word: string) => {
    if (type === 'Brands') addBrand(word);
    if (type === 'Extra Positive Words') addExtra(word);
    if (type === 'Negative Words') addNegative(word);
    if (type === 'Positive Words') addWords(word);
  };
  const handleDelete = (word: string) => {
    if (type === 'Brands') deleteBrand(word);
    if (type === 'Extra Positive Words') deleteExtra(word);
    if (type === 'Negative Words') deleteNegative(word);
    if (type === 'Positive Words') deleteWords(word);
  };

  const evalDisabled = words.length <= 1;

  const evalType =
    type === 'Brands'
      ? suggestedBrands
      : type === 'Extra Positive Words'
      ? suggestedExtra
      : type === 'Negative Words'
      ? suggestedNegative
      : suggestedWords;
  const Words =
    type === 'Brands'
      ? brands
      : type === 'Extra Positive Words'
      ? extra
      : type === 'Negative Words'
      ? negative
      : words;

  const handleClear = () => {
    if (type === 'Brands') clearSuggestedBrands();
    if (type === 'Extra Positive Words') clearSuggestedExtra();
    if (type === 'Negative Words') clearSuggestedNegative();
    if (type === 'Positive Words') clearSuggestedWords();
  };

  return (
    <>
      {evalType.length === 0 ? (
        <Button
          variant='secondary'
          onClick={() => {
            if (!evalDisabled) {
              clickHandler();
              return;
            } else {
              showToast({
                message: 'Alert',
                description:
                  'To make the AI-generated result more reliable, please add at least two positive keywords.',
                type: 'error',
              });
            }
          }}
          className={cn(' w-full')}
          type='button'
        >
          {isLoading ? (
            <>
              <CustomLoading message='Thinking...' />
            </>
          ) : (
            <>
              <Bot className='dark:text-green-500 text-green-700 ' />
              {type === 'Brands' ? 'Gen Brands' : `Generate ${type} with A.I.`}
            </>
          )}
        </Button>
      ) : (
        <CustomSheet
          title={`Generate and Select ${type}`}
          tooltipContentElement={<ToolTipContent type={type} />}
          trigger={
            <SheetTrigger asChild>
              <Button
                variant={'secondary'}
                className={cn(
                  ' w-full flex-1 justify-between relative bg-green-500/10'
                )}
                type='button'
                onClick={() => setShowNotification(false)}
              >
                <Bot className='dark:text-green-500 bg-green-500/10 rounded text-green-700 ' />
                {type === 'Brands' ? type : `Generate ${type} With A.I.`}
                <ChevronRight />
                {showNotification && (
                  <>
                    <span className='rounded-full size-3  absolute -top-1 -right-1 bg-green-500/50 animate-ping' />
                    <span className='rounded-full size-2    absolute -top-0.5 -right-0.5 bg-green-500 ' />
                  </>
                )}
              </Button>
            </SheetTrigger>
          }
        >
          <div className='min-h-[80dvh] w-full overflow-y-auto'>
            {isLoading && <CustomPageLoader message={`Generating ${type}`} />}
            {evalType.length === 0 && !isLoading && (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{`No ${type} Generated`}</EmptyTitle>
                  <EmptyDescription>{`Use the Generate ${type} Button Bellow to Start`}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {evalType.length > 0 && !isLoading && (
              <Table className='mt-6'>
                <TableHeader>
                  <TableRow>
                    <TableHead>{type}</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evalType.map((word, index) => (
                    <TableRow key={index}>
                      <TableCell>{word}</TableCell>
                      <TableCell className='flex items-center justify-end'>
                        {Words.includes(word) ? (
                          <Button
                            size={'xs'}
                            variant='ghost'
                            className='bg-destructive/10 text-destructive'
                            onClick={() => handleDelete(word)}
                          >
                            <Trash2 />
                          </Button>
                        ) : (
                          <Button
                            size={'xs'}
                            variant='ghost'
                            className='bg-green-500/10 text-green-500'
                            onClick={() => handleAdd(word)}
                          >
                            <Plus />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <SheetClose asChild>
            <Button onClick={handleClear}> Finish {type} Selection</Button>
          </SheetClose>
        </CustomSheet>
      )}
    </>
  );
};

const ToolTipContent = ({
  type,
}: {
  type: 'Positive Words' | 'Negative Words' | 'Extra Positive Words' | 'Brands';
}) => {
  const words = usePositiveStore((st) => st.words);
  const negative = useNegativeStore((st) => st.words);
  const extra = useExtraPositiveStore((st) => st.words);
  const brands = useBrandStore((st) => st.words);

  const evalType =
    type === 'Brands'
      ? brands
      : type === 'Extra Positive Words'
      ? extra
      : type === 'Negative Words'
      ? negative
      : words;

  return (
    <>
      {evalType.length === 0
        ? `No ${type} added`
        : `${evalType.length} ${type} Added`}
    </>
  );
};
