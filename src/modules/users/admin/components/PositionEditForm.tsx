'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AddPositionFormType, editpositionSchema } from './models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { PositionManagementRepository } from '@/infraestructure/repositories/PositionManagementRepository';
import { toast } from 'sonner';
import { CustomInput } from '@/components/CustomInput';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
import { PositionRolesSelector } from './PositionRoleSelector';

export const EditPositionForm = ({ id }: { id: string }) => {
  const router = useRouter();
  //   const repository = new PositionManagementRepository();

  const repository = useMemo(() => new PositionManagementRepository(), []);

  const [loading, setLoading] = useState(true);
  const [positionName, setPositionName] = useState<string>('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddPositionFormType>({
    resolver: zodResolver(editpositionSchema),
  });

  useEffect(() => {
    const loadPosition = async () => {
      try {
        const position = await repository.findById(id);
        setPositionName(position?.name.getValue() ?? '');
        if (!position) {
          toast.error('Position not found');
          router.push('/admin/positions-management');
          return;
        }

        const nameValue =
          typeof position.name === 'string'
            ? position.name
            : position.name.getValue();

        setValue('name', nameValue);
        setValue('description', position.description || '');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Error loading position data'
        );
      } finally {
        setLoading(false);
      }
    };
    loadPosition();
  }, [id, setValue, repository, router]);

  const onSubmit = async (data: AddPositionFormType) => {
    try {
      await repository.update(id, { ...data, roleIds: selectedRoleIds });
      toast.success('Position updated successfully');
      router.push('/admin/positions-management');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error updating position'
      );
    }
  };

  if (loading) {
    return <div className='text-center p-6'>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className='text-2xl font-semibold mb-4'>
        Edit Position {positionName}
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex  flex-col gap-4 max-w-xl'
        >
          <CustomInput
            name='name'
            label='Position Name'
            placeholder='Enter the position name'
            register={register}
            error={errors.name}
          />

          <CustomInput
            name='description'
            label='Description'
            placeholder='Enter description'
            register={register}
            error={errors.description}
          />
          <PositionRolesSelector
            selectedRoleIds={selectedRoleIds}
            onChange={setSelectedRoleIds}
          />

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => router.push('/admin/positions-management')}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
