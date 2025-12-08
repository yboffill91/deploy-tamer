import { LoadingBase } from './LoadingBase';

export const CustomLoading = ({ message }: { message: string }) => {
  return (
    <div className='flex gap-2 items-center animate-pulse'>
      <LoadingBase variant='xs' />
      <span className='capitalize'> {message} </span>
    </div>
  );
};
