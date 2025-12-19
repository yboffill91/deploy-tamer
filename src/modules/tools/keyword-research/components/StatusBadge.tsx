import { Badge } from '@/components/ui';
import { KeywordStatus } from '@/core/entities';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  CircleDashed,
  CircleDotDashed,
  Loader,
} from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const getColorStatus =
    status === KeywordStatus.DRAFT
      ? 'text-gray-500 dark:text-gray-400'
      : status === KeywordStatus.KEYWORING
      ? 'text-blue-500 dark:text-blue-600'
      : status === KeywordStatus.READY_TO_CHECK
      ? 'text-orange-500 dark:text-orange-600'
      : status === KeywordStatus.RE_KEYWORING
      ? 'text-sky-500 dark:text-sky-600'
      : status === KeywordStatus.ORGANIC_LAUNCH
      ? 'text-purple-500 dark:text-purple-600'
      : status === KeywordStatus.ORGANIC_FINISHED
      ? 'text-lime-500 dark:text-lime-600'
      : 'text-green-500 dark:text-green-600';

  const StatusIcon =
    status === KeywordStatus.DRAFT ? (
      <CircleDashed className={getColorStatus} />
    ) : status === KeywordStatus.KEYWORING ||
      status === KeywordStatus.RE_KEYWORING ||
      status === KeywordStatus.ORGANIC_LAUNCH ? (
      <Loader className='animate-spin' />
    ) : status === KeywordStatus.READY_TO_CHECK ? (
      <CircleDotDashed className={getColorStatus} />
    ) : (
      <CheckCircle className={getColorStatus} />
    );

  return (
    <Badge
      className={cn('text-xs capitalize text-muted-foreground')}
      variant='outline'
    >
      {' '}
      {StatusIcon} {status.toLowerCase().replace(/_/g, ' ')}{' '}
    </Badge>
  );
};
