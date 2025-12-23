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
      ? 'text-gray-500 dark:text-gray-400 bg-gray-500/10 rounded'
      : status === KeywordStatus.KEYWORING
      ? 'text-info '
      : status === KeywordStatus.READY_TO_CHECK
      ? 'text-warning bg-warning/10 rounded'
      : status === KeywordStatus.RE_KEYWORING
      ? 'text-info '
      : status === KeywordStatus.ORGANIC_LAUNCH
      ? 'text-info'
      : 'text-success bg-success/20 rounded ';

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
