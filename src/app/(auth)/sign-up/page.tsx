import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from '@/modules/auth/components/SignUpForm';

export default function RegisterPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-semibold text-balance'>
            Sign Up
          </CardTitle>
          <CardDescription>Type your data to get Signed Up</CardDescription>
        </CardHeader>
        <SignUpForm />
        <CardFooter>
          <p className='text-sm text-muted-foreground text-center w-full'>
            Allready have an account?{' '}
            <Link
              href='/sign-in'
              className='text-primary hover:underline font-medium'
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
