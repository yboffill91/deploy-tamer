import { PropsWithChildren, ReactNode } from 'react';
import {
  Button,
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
} from './ui';
import { LucideIcon } from 'lucide-react';
import { CustomLoading } from './CustomLoading';

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
          <div>{trigger}</div>
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

interface TriggerButtonProps {
  label: string;
  loadingState?: boolean;
  icon: LucideIcon;
}

export const Triggerbutton = ({
  label,
  loadingState = false,
  icon: Icon,
}: TriggerButtonProps) => {
  return (
    <Button asChild type='button' disabled={loadingState} className='w-full'>
      <SheetTrigger>
        {loadingState ? (
          <CustomLoading message={label} />
        ) : (
          <>
            <Icon /> <span className='capitalize'>{label}</span>
          </>
        )}
      </SheetTrigger>
    </Button>
  );
};
