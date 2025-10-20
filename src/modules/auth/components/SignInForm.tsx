'use client';

import { Button, CardContent } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { userLoginSchema, userLoginType } from '../models';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '@/components/CustomInput';
import { ButtonsSelectProviders } from './ButtonsSelectProviders';
import { CustomLoading } from '@/components/CustomLoading';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../providers/AuthProvider';
import Link from 'next/link';
import { useEffect } from 'react';

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userLoginType>({
    resolver: zodResolver(userLoginSchema),
    mode: 'onBlur',
  });
  const router = useRouter();
  const { login, error, loading } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: userLoginType) => {
    await login(data.email, data.password);
    router.push('/profile');
  };

  return (
    <CardContent className='space-y-4'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div>
          <CustomInput
            register={register}
            error={errors.email}
            label='Email'
            name='email'
            placeholder='john@mail.com'
            type='email'
            tabindex={1}
          />
          <div className='w-full  flex items-center justify-end'>
            <Link
              href={'/forgot-password'}
              className='text-right text-sm w-full text-muted-foreground'
              tabIndex={3}
            >
              Forgot your password?
            </Link>
          </div>
          <div>
            <CustomInput
              register={register}
              error={errors.password}
              label='Password'
              name='password'
              placeholder='*********'
              type='password'
              tabindex={2}
            />
          </div>
        </div>
        <Button
          className={cn(
            'w-full',
            loading && 'bg-muted text-muted-foreground/50 pointer-events-none'
          )}
          size='lg'
          type='submit'
          tabIndex={4}
        >
          {loading ? (
            <CustomLoading message='Loading' />
          ) : (
            <>
              <LogIn />
              Sign In
            </>
          )}
        </Button>
      </form>
      <ButtonsSelectProviders loadingMessage='Loading' />
    </CardContent>
  );
};
