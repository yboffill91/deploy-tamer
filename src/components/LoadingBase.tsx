import { cn } from '@/lib/utils';

interface Props {
  variant?: 'xs' | 'sm' | 'md' | 'lg';
}

export const LoadingBase = ({ variant = 'xs' }: Props) => {
  const variantValue =
    variant === 'xs'
      ? 'size-0.5'
      : variant === 'sm'
      ? 'size-3'
      : variant === 'md'
      ? 'size-4'
      : 'size-6';
  return (
    <div>
      <div
        className={cn(
          'flex justify-center',
          variant === 'xs' ? 'gap-1' : variant === 'lg' ? 'gap-3' : 'gap-2'
        )}
      >
        <div
          className={cn(
            ' animate-bounce rounded-full bg-primary [animation-delay:-0.3s]',
            variantValue
          )}
        ></div>
        <div
          className={cn(
            ' animate-bounce rounded-full bg-primary [animation-delay:-0.15s]',
            variantValue
          )}
        ></div>
        <div
          className={cn(
            ' animate-bounce rounded-full bg-primary',
            variantValue
          )}
        ></div>
      </div>
    </div>
  );
};
