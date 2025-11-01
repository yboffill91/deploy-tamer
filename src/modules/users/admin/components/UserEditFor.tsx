'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { UserDTO } from '@/core/dto';
import { UserManagementRepository } from '@/infraestructure/repositories';
import { UserEditFormType, UserEditSchema } from './models';
import { CustomInput } from '@/components/CustomInput';
import { useRouter } from 'next/navigation';

interface Props {
  userId: string;
  onSave?: () => void;
}

export const UserEditForm = ({ userId, onSave }: Props) => {
  const repository = useMemo(() => new UserManagementRepository(), []);
  const { positions, loading: loadingPositions } = usePositions();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDTO | null>(null);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormType>({
    resolver: zodResolver(UserEditSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      const found = await repository.findById(userId);
      if (found) {
        setUser(found);
        setValue('name', found.name);
        setValue('email', found.email);
        setValue('positionId', found.positionId);
      }
      setLoading(false);
    };
    loadUser();
  }, [repository, userId, setValue]);

  const onSubmit = async (data: UserEditFormType) => {
    if (!user) return;

    try {
      const updated: UserDTO = { ...user, ...data };
      await repository.save(updated);
      toast.success('User updated successfully');
      onSave?.();
      router.push('/admin/users');
    } catch (err) {
      toast.error('Error updating user');
      console.error(err);
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <CustomInput
        name='name'
        label='Full Name'
        placeholder='Enter Full Name'
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
            onValueChange={(value) => setValue('positionId', value)}
            defaultValue={user?.positionId}
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
          <span className='text-sm  text-destructive'>
            {errors.positionId.message}
          </span>
        )}
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
