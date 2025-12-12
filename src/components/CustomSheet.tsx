import { PropsWithChildren, ReactNode } from 'react';
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui';
import { cn } from '@/lib/utils';

interface SheetProps extends PropsWithChildren {
  title: string;
  description?: string;
  trigger: ReactNode;
  tooltipContentElement: ReactNode;
  showClose?: boolean;
  isBrandButton?: boolean;
}

export const CustomSheet = ({
  title,
  description,
  trigger,
  tooltipContentElement,
  children,
  showClose = false,
  isBrandButton = false,
}: SheetProps) => {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild type='button'>
          <div className={cn('w-full', isBrandButton && 'col-span-4')}>
            {trigger}
          </div>
        </TooltipTrigger>
        <TooltipContent className='flex items-center justify-center gap-2'>
          {tooltipContentElement}
        </TooltipContent>
      </Tooltip>
      <SheetContent className='p-4'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetDescription>{description}</SheetDescription>
        {children}
        {showClose && (
          <SheetClose type='button' asChild>
            <Button type='button' variant={'default'}>
              Close
            </Button>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
};
