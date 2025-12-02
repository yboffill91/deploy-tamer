import { Badge } from '@/components/ui';
import { KeywordResearchEntity } from '@/core/entities';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const StatusBadge = ({
  value,
}: {
  value: KeywordResearchEntity['status'];
}) => {
  return (
    <Badge
      className={cn(
        value === 'CREATED' &&
          'bg-green-500/10 dark:text-green-500 text-green-700',
        value === 'IN_PROGRESS' &&
          'bg-orange-500/10 dark:text-orange-500 text-orange-700'
      )}
    >
      <Loader2
        className={value === 'IN_PROGRESS' ? 'block animate-spin' : 'hidden'}
      />{' '}
      {value.replace('_', ' ')}
    </Badge>
  );
};
