'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePositions } from '../hooks/usePosition';
import {
  Button,
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { UserDTO } from '@/core/dto';
import { UserManagementRepository } from '@/infraestructure/repositories';
import { UserAddFormType, UserAddSchema } from './models';
import { CustomInput } from '@/components/CustomInput';
import { useRouter } from 'next/navigation';

interface Props {
  onSave?: () => void;
}

export const UserAddForm = ({ onSave }: Props) => {
  const repository = useMemo(() => new UserManagementRepository(), []);
  const { positions, loading: loadingPositions } = usePositions();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserAddFormType>({
    resolver: zodResolver(UserAddSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: UserAddFormType) => {
    console.log('✅ Submit triggered', data);
    try {
      setLoading(true);

      const newUser: UserDTO = {
        id: uuid(),
        name: data.name,
        email: data.email,
        positionId: data.positionId,
        photoUrl: '',
      };

      await repository.save(newUser);
      toast.success('User created successfully');
      reset();
      onSave?.();
      router.push('/admin/users');
    } catch (err) {
      console.error(err);
      toast.error('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className='space-y-4'>
      <CustomInput
        name='name'
        label='Full Name'
        placeholder='Enter full name'
        register={register}
        error={errors.name}
      />

      <CustomInput
        name='email'
        label='Email'
        placeholder='john@example.com'
        register={register}
        error={errors.email}
      />

      <div className='flex flex-col gap-1'>
        <Label htmlFor='positionId'>Position</Label>
        {loadingPositions ? (
          <p>Loading positions...</p>
        ) : (
          <Select
            onValueChange={(value) =>
              setValue('positionId', value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select position' />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.id}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.positionId && (
          <span className='text-sm text-destructive'>
            {errors.positionId.message}
          </span>
        )}
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting || loading}>
          {isSubmitting || loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};
