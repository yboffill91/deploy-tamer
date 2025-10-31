'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { v4 as uuid } from 'uuid';
import { toast } from 'react-hot-toast';
import { usePositions } from '../hooks/usePosition';
import { PositionManagementRepository } from '@/infraestructure/repositories/PositionManagementRepository';
import { Position, PositionName } from '@/core';
import { CustomInput } from '@/components/CustomInput';

import { AddPositionFormType, addPositionSchema } from './models';
import { Button } from '@/components/ui';
import { useState } from 'react';
import { PositionRolesSelector } from './PositionRoleSelector';

export function AddPositionForm() {
  const { refresh } = usePositions();

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const repository = new PositionManagementRepository();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPositionFormType>({
    resolver: zodResolver(addPositionSchema),
    defaultValues: { name: '', description: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: AddPositionFormType) => {
    try {
      const newPosition = new Position(
        uuid(),
        new PositionName(data.name),
        data.description,
        selectedRoleIds
      );
      await repository.save(newPosition);
      toast.success('Position added successfully');
      reset();
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error adding new Position'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-2'>
      <CustomInput
        label='Position Name'
        placeholder='Enter position name'
        name='name'
        register={register}
        error={errors.name}
      />
      <CustomInput
        label='Description'
        placeholder='Enter description (optional)'
        name='description'
        register={register}
        error={errors.description}
      />
      <PositionRolesSelector
        selectedRoleIds={selectedRoleIds}
        onChange={setSelectedRoleIds}
      />

      <div className='flex justify-end gap-2'>
        <Button type='submit'>Save</Button>
      </div>
    </form>
  );
}
