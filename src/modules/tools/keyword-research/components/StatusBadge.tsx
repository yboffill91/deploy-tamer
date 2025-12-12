import { Badge } from '@/components/ui';
import { KeywordStatus } from '@/core/entities';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, CircleDotDashed, Loader } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const getColorStatus =
    status === KeywordStatus.DRAFT
      ? 'bg-slate-500/10 text-slate-500 dark:text-slate-600'
      : status === KeywordStatus.KEYWORING
      ? 'bg-blue-500/10 text-blue-500 dark:text-blue-600'
      : status === KeywordStatus.READY_TO_CHECK
      ? 'bg-orange-500/10 text-orange-500 dark:text-orange-600'
      : status === KeywordStatus.RE_KEYWORING
      ? 'bg-sky-500/10 text-sky-500 dark:text-sky-600'
      : 'bg-green-500/10 text-green-500 dark:text-green-600';

  const StatusIcon =
    status === KeywordStatus.DRAFT ? (
      <Circle />
    ) : status === KeywordStatus.KEYWORING ||
      status === KeywordStatus.RE_KEYWORING ? (
      <Loader className='animate-spin' />
    ) : status === KeywordStatus.READY_TO_CHECK ? (
      <CircleDotDashed />
    ) : (
      <CheckCircle />
    );

  return (
    <Badge className={cn('text-xs font-semibold capitalize', getColorStatus)}>
      {' '}
      {status.toLowerCase().replace(/_/g, ' ')} {StatusIcon}{' '}
    </Badge>
  );
};
