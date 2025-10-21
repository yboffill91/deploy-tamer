import { Button } from '@/components/ui';
import Link from 'next/link';

export default function MessagePage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-background '>
      <div className='text-center space-y-4 w-fullborder rounded-lg'>
        <h1 className='text-4xl font-semibold text-balance'>
          Tamer Digital Working On It
        </h1>
        <p className='text-lg text-muted-foreground text-pretty'>
          This is a public page
        </p>
        <Link href={'/sign_in'}>
          <Button>Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
