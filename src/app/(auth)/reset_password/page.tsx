'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomLoading } from '@/components/CustomLoading';
import { CustomInput } from '@/components/CustomInput';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useResetPasswordConfirm } from '@/modules/auth/hooks/useResetPasswordConfirm';
import toast from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Must contain at least one number' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const oobCode = params.get('oobCode');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { confirmPassword, loading: isLoading } = useResetPasswordConfirm();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!oobCode) {
      setError('Invalid verification code');
      return;
    }

    await confirmPassword(oobCode, data.password);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 bg-muted/30'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <CheckCircle2 className='h-6 w-6 text-primary' />
            </div>
            <CardTitle className='text-2xl'>Password updated</CardTitle>
            <CardDescription>
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-center text-sm text-muted-foreground mb-6'>
              You can now log in with your new password.
            </p>
            <Button asChild className='w-full'>
              <Link href='/login'>Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-muted/30'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Reset password</CardTitle>
          <CardDescription>
            Enter your new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <CustomInput
              name='password'
              label='New password'
              placeholder='••••••••'
              register={form.register}
              error={form.formState.errors.password}
              type='password'
            />

            <CustomInput
              name='confirmPassword'
              label='Confirm password'
              placeholder='••••••••'
              register={form.register}
              error={form.formState.errors.confirmPassword}
              type='password'
            />

            <Button disabled={isLoading} type='submit' className='w-full'>
              {isLoading ? (
                <CustomLoading message='Updating...' />
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
