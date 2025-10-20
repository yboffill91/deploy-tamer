export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='text-center'>
        <div className='mb-6 flex justify-center gap-2'>
          <div className='h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]'></div>
          <div className='h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]'></div>
          <div className='h-3 w-3 animate-bounce rounded-full bg-primary'></div>
        </div>

        <div className='space-y-2'>
          <div className='h-2 w-48 animate-pulse rounded-full bg-muted'></div>
          <div className='h-2 w-36 animate-pulse rounded-full bg-muted [animation-delay:0.15s]'></div>
        </div>
      </div>
    </div>
  );
}
