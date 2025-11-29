import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import {
  useBrandStore,
  useExtraPositiveStore,
  useNegativeStore,
  usePositiveStore,
} from '../context/WordsStoreFactory';
import { CustomLoading } from '@/components/CustomLoading';
import { Bot } from 'lucide-react';
import { CreateSuggestDTO } from '@/core/dto';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/CustomToaster';

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

  return (
    <Tooltip>
      <TooltipTrigger asChild type='button'>
        <Button
          variant={'secondary'}
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
              {type}
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{`Generate ${type} Using IA`}</TooltipContent>
    </Tooltip>
  );
};
