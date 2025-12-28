import { EllipsisVertical, Loader, type LucideIcon } from 'lucide-react';
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
import { LoadingBase } from '../LoadingBase';

export interface ActionConfig<T> {
  icon: LucideIcon;
  label: string;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  variant?:
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'secondary'
    | 'ghostDestructive';
}

export interface ActionsButtonSetProps<T> {
  item: T;
  actions: ActionConfig<T>[];
  className?: string;
  showRow?: boolean;
  bussy?: boolean;
}

export function ActionsButtonSet<T>({
  item,
  actions,
  className = '',
  showRow = false,
  bussy = false,
}: ActionsButtonSetProps<T>) {
  return (
    <div className='flex gap-1 items-center justify-end    rounded'>
      {showRow ? (
        <>
          {bussy ? (
            <div className='w-full flex items-center justify-center'>
              <Loader className='animate-spin size-4' />
            </div>
          ) : (
            actions
              .filter((a) => (a.show ? a.show(item) : true))
              .map(({ icon: Icon, label, onClick, variant }, idx) => (
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
                    <p className='capitalize'>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))
          )}
        </>
      ) : (
        <>
          {bussy ? (
            <Loader className='animate-spin size-4' />
          ) : (
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
        </>
      )}
    </div>
  );
}
