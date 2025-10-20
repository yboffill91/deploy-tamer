import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from '@/modules/auth/components/SignInForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-semibold text-balance'>
            Sign In
          </CardTitle>
          <CardDescription>
            Type your credentials to fully access
          </CardDescription>
        </CardHeader>
        <SignInForm />
        <CardFooter>
          <p className='text-sm text-muted-foreground text-center w-full'>
            Don&apos;t have an account yet?{' '}
            <Link
              href='/sign-up'
              className='text-primary hover:underline font-medium'
            >
              Sign-Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
