import { ChevronDown, LucideIcon, Trash2 } from 'lucide-react';
import { useRegionStore } from '../context/RegionStore';
import { CustomLoading } from '@/components/CustomLoading';
import { showToast } from '@/components/CustomToaster';
import {
  Button,
  SheetTrigger,
  PopoverTrigger,
  PopoverContent,
  Popover,
  ButtonGroup,
} from '@/components/ui';

import { cn } from '@/lib/utils';

interface TriggerButtonProps {
  label: string;
  loadingState?: boolean;
  icon: LucideIcon;
}
export const RegionsTrigguer = ({
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

  return (
    <>
      <ButtonGroup className='w-full'>
        <Button
          asChild
          variant='secondary'
          type='button'
          disabled={loadingState}
          className={cn(
            selectedList.size === 0 ? 'w-full' : 'flex-1 rounded-e-none'
          )}
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
              <Button
                size='icon'
                variant='secondary'
                className={'opacity-90 rounded-s-none'}
              >
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='max-h-96 h-full overflow-y-auto w-72'>
                {items.map((item) => (
                  <div
                    key={item.key}
                    className='w-64 text-xs group hover:bg-accent p-2 flex items-center justify-between rounded-md transition-all'
                  >
                    {item.value.join(' / ')}
                    <Button
                      size='sm'
                      variant='destructive'
                      className={cn(
                        'size-6 bg-destructive/10! hidden group-hover:flex'
                      )}
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
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </ButtonGroup>
    </>
  );
};
