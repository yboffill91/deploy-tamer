import { showToast } from '@/components/CustomToaster';
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { Copy, X, XCircle } from 'lucide-react';

interface Props {
  message: string;
  list: string[] | [];
  onDelete(value: string): void;
}

export const WordsContainer = ({ message, list, onDelete }: Props) => {
  const copyToClipBoardArray = (arr: string[]) => {
    const text = arr.join(', ');
    showToast({
      type: 'success',
      message: 'Copied',
      description: 'List copied to Clipboard',
    });
    return navigator.clipboard.writeText(text);
  };
  return (
    <div className='relative'>
      <div
        className={cn(
          ' flex items-center  justify-end ',
          list.length === 0 && 'hidden'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild type='button'>
            <Button
              size={'sm'}
              variant={'secondary'}
              onClick={() => copyToClipBoardArray(list)}
              className='size-6  absolute top-0'
              type='button'
            >
              <Copy className='text-foreground/50' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to ClipBoard</TooltipContent>
        </Tooltip>
      </div>
      <div className='w-full h-32 overflow-y-auto border rounded-lg bg-accent/20 flex gap-2 items-start justify-start p-4 flex-wrap'>
        {list.length === 0 && (
          <p className='text-accent-foreground/50 w-full text-center'>
            {message}
          </p>
        )}
        {list.map((word, i) => (
          <Badge key={word + i} variant={'secondary'}>
            {word}{' '}
            <span
              className='ms-2 h-3 w-4 flex items-center justify-center  rounded-sm cursor-pointer'
              onClick={() => onDelete(word)}
            >
              <X className='h-3  ' />
            </span>{' '}
          </Badge>
        ))}
      </div>
    </div>
  );
};
