import { Loader } from 'lucide-react';

export const CustomLoading = ({ message }: { message: string }) => {
  return (
    <div className='flex gap-2 items-center animate-pulse'>
      <Loader className='animate-spin' />
      <span className='capitalize'> {message} </span>
    </div>
  );
};
