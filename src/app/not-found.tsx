'use client';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ChevronLeftCircle, FileQuestion } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-md text-center bg-transparent border-none'>
        <CardHeader>
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
            Sorry, look&apos;s like we don&apos;t have what you are looking for!
          </p>
        </CardHeader>
        <CardContent>
          <Button
            size='lg'
            className='w-full sm:w-auto'
            onClick={() => router.back()}
          >
            <ChevronLeftCircle /> Get me back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
