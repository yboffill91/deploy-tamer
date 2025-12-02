import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  selectedItem: unknown;
}

import {} from 'radix-ui';
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui';

export const ShowDetails = ({ open, onOpenChange, selectedItem }: Props) => {
  const getDateFormated = (value: string) => {
    const fdate = new Date(value);
    return <p>{fdate.toDateString().toString()}</p>;
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Registry Details</DialogTitle>
          <DialogDescription>
            Complete information of the selected row.
          </DialogDescription>
        </DialogHeader>

        {selectedItem ? (
          <div className='space-y-2 max-h-[70vh] overflow-y-auto'>
            {Object.entries(selectedItem).map(([key, value]) => (
              <div
                key={key}
                className={cn(
                  'border-b py-2',
                  value === undefined ||
                    !value ||
                    (value.isArray && value.length === 0)
                    ? 'hidden'
                    : 'block',
                  key === 'id' && 'hidden'
                )}
              >
                <span className='font-medium capitalize'>{key}</span>
                <div className='mt-1 text-sm text-muted-foreground'>
                  {typeof value === 'object' ? (
                    <pre className='bg-secondary p-2 rounded-md overflow-x-auto text-xs whitespace-pre-wrap'>
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : key === 'createdAt' ||
                    key === 'updatedAt' ||
                    key === 'deletedAt' ? (
                    <span>{getDateFormated(value)}</span>
                  ) : (
                    <span>{String(value)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No data</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
