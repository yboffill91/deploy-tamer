import { LoaderIcon } from 'lucide-react';

export const CustomLoading = ({ message }: { message: string }) => {
  return (
    <div className='flex gap-2 items-center animate-pulse'>
      <LoaderIcon className='animate-spin size-4' />
      {message}
    </div>
  );
};
