import { Card, Skeleton } from './ui';

interface CustomPageLoaderProps {
  message?: string;
}

export function CustomPageLoader({
  message = 'Loading Data...',
}: CustomPageLoaderProps) {
  return (
    <div className='w-full space-y-6 p-6'>
      <div className='flex  items-center  gap-4 '>
        <div className='relative size-8'>
          <div className='absolute inset-0 rounded-full border-4 border-muted'></div>
          <div className='absolute inset-0 rounded-full border-4 border-primary border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin'></div>
        </div>
        <p className='text-sm font-medium text-muted-foreground animate-pulse capitalize'>
          {message}
        </p>
      </div>

      <Card className='overflow-hidden'>
        <div className='border-b border-border'>
          <div className='grid grid-cols-4 gap-4 p-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`header-${i}`} className='space-y-2'>
                <Skeleton className='h-4 w-24' />
              </div>
            ))}
          </div>
        </div>

        <div className='divide-y divide-border'>
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className='grid grid-cols-4 gap-4 p-4'>
              {Array.from({ length: 4 }).map((_, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className='space-y-2'>
                  <Skeleton
                    className='h-4 w-full'
                    style={{
                      animationDelay: `${(rowIdx + colIdx) * 0.1}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
