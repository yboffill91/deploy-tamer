import { EllipsisVertical, type LucideIcon } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';
import { cn } from '@/lib/utils';

export interface ActionConfig<T> {
  icon: LucideIcon;
  label: string;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  variant?: 'ghost' | 'destructive' | 'success' | 'secondary';
  tooltipMessage?: string;
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
      {actions.length === 1 &&
        actions
          .filter((a) => (a.show ? a.show(item) : true))
          .map(
            (
              { icon: Icon, label, onClick, variant, tooltipMessage = '' },
              idx
            ) => (
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
            )
          )}
      {actions.length >= 2 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='xs'>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actions
                .filter((a) => (a.show ? a.show(item) : true))
                .map(({ icon: Icon, label, onClick, variant }, idx) => (
                  <DropdownMenuItem key={idx}>
                    <Button
                      variant={variant ?? 'ghost'}
                      onClick={() => onClick(item)}
                      aria-label={label}
                      className={cn(className, 'w-full justify-start h-6 ')}
                    >
                      <Icon className='size-4' />{' '}
                      <span className='capitalize'>{label}</span>
                    </Button>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
