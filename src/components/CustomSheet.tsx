import { PropsWithChildren, ReactNode } from 'react';
import {
  Button,
  ButtonGroup,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Badge,
} from './ui';
import { ChevronDown, LucideIcon, Trash2 } from 'lucide-react';
import { CustomLoading } from './CustomLoading';
import { useRegionStore } from '@/modules/tools/keyword-research/context/RegionStore';
import { showToast } from './CustomToaster';

interface SheetProps extends PropsWithChildren {
  title: string;
  description?: string;
  trigger: ReactNode;
  tooltipContentElement: ReactNode;
  showClose?: boolean;
}

export const CustomSheet = ({
  title,
  description,
  trigger,
  tooltipContentElement,
  children,
  showClose = false,
}: SheetProps) => {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild type='button'>
          <div className='w-full'>{trigger}</div>
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
