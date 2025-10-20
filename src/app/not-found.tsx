import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <div className='w-full max-w-md text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-muted p-4'>
            <FileQuestion className='h-12 w-12 text-muted-foreground' />
          </div>
        </div>

        <div className='mb-4'>
          <span className='text-7xl font-bold text-primary'>404</span>
        </div>

        <h1 className='mb-2 text-3xl font-bold text-foreground'>Not Found</h1>

        <p className='mb-8 text-balance text-muted-foreground'>
          Sorry, look&apos;s like we missmach something!
        </p>

        <Button asChild size='lg' className='w-full sm:w-auto'>
          <Link href='/'>
            Back to Home <Home />
          </Link>
        </Button>
      </div>
    </div>
  );
}
