import { type LucideIcon } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../ui';

export interface ActionConfig<T> {
  icon: LucideIcon;
  label: string;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  variant?: 'ghost' | 'destructive' | 'success' | 'secondary';
  tooltipMessage: string;
}

export interface ActionsButtonSetProps<T> {
  item: T;
  actions: ActionConfig<T>[];
  className?: string;
}

export function ActionsButtonSet<T>({
  item,
  actions,
  className = '',
}: ActionsButtonSetProps<T>) {
  return (
    <div className='flex gap-1 items-center justify-end    rounded'>
      {actions
        .filter((a) => (a.show ? a.show(item) : true))
        .map(({ icon: Icon, label, onClick, variant, tooltipMessage }, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <Button
                size='xs'
                variant={variant ?? 'ghost'}
                onClick={() => onClick(item)}
                aria-label={label}
                className={className}
              >
                <Icon className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        ))}
    </div>
  );
}
