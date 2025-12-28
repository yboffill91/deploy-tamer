import { cn } from '@/lib/utils';

export const TableHeadLabel = ({
  label, isCentered = false,
}: {
  label: string;
  isCentered?: boolean;
}) => {
  return (
    <div className={cn('w-full', isCentered && 'text-center')}>{label}</div>
  );
};
