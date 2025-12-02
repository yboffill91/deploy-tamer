import { Badge } from '@/components/ui';
import { KeywordResearchEntity } from '@/core/entities';
import { cn } from '@/lib/utils';

export const TypeBadge = ({
  value,
}: {
  value: KeywordResearchEntity['type'];
}) => {
  return (
    <Badge
      className={cn(
        value === 'TRANSACTIONAL' &&
          'bg-green-500/10 dark:text-green-500 text-green-700',
        value === 'INFORMATIONAL' &&
          'bg-orange-500/10 dark:text-orange-500 text-orange-700'
      )}
    >
      {value.replace('_', ' ')}
    </Badge>
  );
};
