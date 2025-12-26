import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { KeywordResultEntity } from '@/core/entities';
import { KeywordInfo } from './KeywordInfo';
import { Button } from '@/components/ui';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword: KeywordResultEntity;
}

export function KeywordInfoSheet({ open, onOpenChange, keyword }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full sm:w-105 overflow-y-auto p-6'
      >
        <SheetHeader className='mb-4'>
          <SheetTitle>Keyword details</SheetTitle>
              </SheetHeader>
              <div className='h-screen bg-accent rounded-lg px-4'>
                  

        <KeywordInfo keyword={keyword} />
              </div>
          <SheetClose asChild><Button >Close Info</Button></SheetClose>
          </SheetContent>
    </Sheet>
  );
}
