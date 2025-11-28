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
import { useRegionStore } from '@/modules/tools/keyword-research/context/NewRegionStore';
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
  const selectedList = useRegionStore((st) => st.finalValue);
  const manageDeleteList = useRegionStore((st) => st.deleteEntryFinalValue);

  const items = Array.from(selectedList, ([key, value]) => ({
    key,
    value,
  }));

  console.log(selectedList);
  return (
    <>
      <ButtonGroup className='w-full'>
        <Button
          asChild
          type='button'
          disabled={loadingState}
          className='w-full'
        >
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
        {selectedList.size > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button size='icon'>
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <Command className='rounded-lg border shadow-md md:min-w-[450px]'>
                <CommandInput placeholder='Search in the selected list' />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading='Selected Regions'>
                    {items.map((item) => (
                      <CommandItem key={item.key}>
                        {item.value.join(' / ')}
                        <Button
                          size='sm'
                          variant='destructive'
                          className='size-6 bg-destructive/10! '
                          onClick={() => {
                            manageDeleteList(item.key);
                            showToast({
                              type: 'success',
                              message: 'Removed Successfully',
                              description: `Removed ${item.value.join(
                                ' / '
                              )} from de Research Regions List`,
                            });
                          }}
                        >
                          <Trash2 className='text-destructive' />
                        </Button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </ButtonGroup>
    </>
  );
};
