import { LucideIcon } from 'lucide-react';
import { Button } from '../ui';

export interface ActionConfig<T> {
  icon: LucideIcon;
  label: string;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  variant?: 'ghost' | 'destructive';
}

export interface ActionsButtonSetProps<T> {
  item: T;
  actions: ActionConfig<T>[];
}

export function ActionsButtonSet<T>({
  item,
  actions,
}: ActionsButtonSetProps<T>) {
  return (
    <div className='flex gap-2 items-center justify-end'>
      {actions
        .filter((a) => (a.show ? a.show(item) : true))
        .map(({ icon: Icon, label, onClick, variant }, idx) => (
          <Button
            key={idx}
            size='xs'
            variant={variant ?? 'ghost'}
            onClick={() => onClick(item)}
            aria-label={label}
          >
            <Icon className='size-4' />
          </Button>
        ))}
    </div>
  );
}
