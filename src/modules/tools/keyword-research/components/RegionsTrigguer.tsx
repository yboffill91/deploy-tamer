import { ChevronDown, List, LucideIcon, Trash2 } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

import { cn } from '@/lib/utils';
import { CustomSheet } from '@/components/CustomSheet';
import { utimes } from 'fs';

interface TriggerButtonProps {
  label: string;
  loadingState?: boolean;
  icon: LucideIcon;
}
export const RegionsTrigger = ({
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
          <CustomSheet
            title='Redefine Selected Regions'
            tooltipContentElement={'Redefine Selected Regions'}
            trigger={
              <Button
                size='icon'
                variant='secondary'
                className={'opacity-90 rounded-s-none flex-2 w-full'}
                type='button'
                asChild
              >
                <SheetTrigger>
                  <List />
                </SheetTrigger>
              </Button>
            }
          >
            <div className=' min-h-[80vh] overflow-y-auto'>
              <Table className='mt-6'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell>{item.value.join(' - ')}</TableCell>
                      <TableCell>
                        <Button
                          size='xs'
                          variant='destructive'
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
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CustomSheet>
        )}
      </ButtonGroup>
    </>
  );
};

export const BrandsTrigger = ({ label, icon: Icon }: TriggerButtonProps) => {
  return (
    <>
      <Button asChild variant='secondary' type='button' className='w-full'>
        <SheetTrigger>
          <Icon /> <span className='capitalize'>{label}</span>
        </SheetTrigger>
      </Button>
    </>
  );
};
