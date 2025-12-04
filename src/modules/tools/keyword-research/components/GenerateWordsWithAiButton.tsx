import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
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
import { Bot, ChevronRight, Trash2 } from 'lucide-react';
import { CreateSuggestDTO } from '@/core/dto';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/CustomToaster';
import { CustomSheet } from '@/components/CustomSheet';
import { CustomPageLoader } from '@/components/CustomPageLoader';

interface Props {
  isLoading: boolean;
  type: 'Positive Words' | 'Negative Words' | 'Extra Positive Words' | 'Brands';
  isBrandButton?: boolean;
}

export const GenerateWordsWithAiButton = ({
  isLoading,
  type,
  isBrandButton = false,
}: Props) => {
  const words = usePositiveStore((st) => st.words);
  const negative = useNegativeStore((st) => st.words);
  const extra = useExtraPositiveStore((st) => st.words);
  const brands = useBrandStore((st) => st.words);

  const removeWords = usePositiveStore((st) => st.deleteWord);
  const removeNegative = useNegativeStore((st) => st.deleteWord);
  const removeExtra = useExtraPositiveStore((st) => st.deleteWord);
  const removeBrands = useBrandStore((st) => st.deleteWord);

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
  };

  const evalDisabled = words.length <= 1;

  const evalType =
    type === 'Brands'
      ? brands
      : type === 'Extra Positive Words'
      ? extra
      : type === 'Negative Words'
      ? negative
      : words;

  const handleDelete = (word: string) => {
    if (type === 'Brands') removeBrands(word);
    if (type === 'Extra Positive Words') removeExtra(word);
    if (type === 'Negative Words') removeNegative(word);
    if (type === 'Positive Words') removeWords(word);
  };

  return (
    <CustomSheet
      title={`Generate and Select ${type}`}
      tooltipContentElement={<ToolTipContent type={type} />}
      trigger={
        <SheetTrigger asChild>
          <Button
            variant={'secondary'}
            className={cn(' w-full flex-1 justify-between')}
            type='button'
          >
            <Bot className='dark:text-green-500 bg-green-500/10 rounded text-green-700 ' />
            {type === 'Brands' ? type : `Generate ${type} With A.I.`}
            <ChevronRight />
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
                <TableHead>Brand</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evalType.map((brand, index) => (
                <TableRow key={index}>
                  <TableCell>{brand}</TableCell>
                  <TableCell className='flex items-center justify-end'>
                    <Button
                      onClick={() => handleDelete(brand)}
                      variant='destructive'
                      size='xs'
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Button
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
        className={cn(' w-full flex-1', isBrandButton && 'rounded-e-none')}
        type='button'
      >
        {isLoading ? (
          <>
            <CustomLoading message='Thinking...' />
          </>
        ) : (
          <>
            <Bot className='dark:text-green-500 bg-green-500/10 rounded text-green-700 ' />
            Generate {type}
          </>
        )}
      </Button>
    </CustomSheet>
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
