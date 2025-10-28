'use client';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '@/components/CustomInput';
import { CustomLoading } from '@/components/CustomLoading';
import { Mail, Save, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/auth';
import { userEditSchema, userEditType } from './models';
import {
  FirebaseAuthRepository,
  UserRepository,
} from '@/infraestructure/repositories';

export const EditUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<userEditType>({
    resolver: zodResolver(userEditSchema),
    mode: 'onBlur',
  });

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userRepository = new FirebaseAuthRepository();

  useEffect(() => {
    setLoading(true);
    try {
      if (user) {
        setValue('name', user.displayName || 'No User Name');
        setValue('email', user.email.getValue() || 'No Email');
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error fetching user data'
      );
    } finally {
      setLoading(false);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const onSubmit = async (data: userEditType) => {
    if (!user) {
      setError('No user found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      await userRepository.updateUser({
        displayName: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success('Profile updated succesfully');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Error updateing profile ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 container  max-w-lg '
    >
      <CustomInput
        register={register}
        error={errors.name}
        label='Name'
        name='name'
        placeholder='John Doe'
        type='text'
        tabindex={1}
        addon={UserIcon}
      />

      <CustomInput
        register={register}
        error={errors.email}
        label='Email'
        name='email'
        placeholder='john@mail.com'
        type='email'
        tabindex={2}
        addon={Mail}
      />

      <CustomInput
        register={register}
        error={errors.password}
        label='Password'
        name='password'
        placeholder='*********'
        type='password'
        tabindex={3}
      />

      <CustomInput
        register={register}
        error={errors.rePassword}
        label='Confirm Password'
        name='rePassword'
        placeholder='*********'
        type='password'
        tabindex={4}
      />

      <Button
        className={cn(
          'w-full',
          loading && 'bg-muted text-muted-foreground/50 pointer-events-none'
        )}
        size='lg'
        type='submit'
        tabIndex={5}
        disabled={loading}
      >
        {loading ? (
          <CustomLoading message='Updating' />
        ) : (
          <>
            {loading ? (
              <CustomLoading message='Loading User Data...' />
            ) : (
              <>
                {' '}
                <Save /> Update Profile
              </>
            )}
          </>
        )}
      </Button>
    </form>
  );
};
