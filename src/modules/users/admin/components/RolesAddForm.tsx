'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RoleManagementRepository } from '@/infraestructure/repositories/RoleManagementRepository';
import { AccessLevel, RolePermission } from '@/core/value-objects';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { Role } from '@/core';
import { CustomInput } from '@/components/CustomInput';
import { CustomLoading } from '@/components/CustomLoading';
import { RoleFormData, RoleSchema } from './models';
import { RolePermissionsTable } from './RolePermisionTable';

interface Props {
  onSuccess?: () => void;
}

export function RolesAddForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: { name: '' },
  });

  const [addingPermission, setAddingPermission] = useState(false);
  const [permissions, setPermissions] = useState<
    { feature: string; access: AccessLevel }[]
  >([]);

  const repository = new RoleManagementRepository();

  const onSubmit = async (data: RoleFormData) => {
    try {
      const newRole = Role.create({
        id: uuid(),
        name: data.name,
        permissions: permissions.map(
          (p) => new RolePermission(p.feature, p.access)
        ),
      });

      await repository.save(newRole);
      toast.success('Role created successfully');
      reset();
      setPermissions([]);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error adding the new role'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
      <CustomInput
        label='New Role Name'
        name='name'
        placeholder='New Role '
        register={register}
        error={errors.name}
      />

      <Separator />

      <div>
        <Label>Permisos</Label>
        {permissions.length > 0 ? (
          <ul className='text-sm mt-2 border rounded-md p-2 space-y-1'>
            {permissions.map((p, i) => (
              <li key={i} className='flex justify-between items-center'>
                <span>
                  {p.feature} — <b>{p.access}</b>
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    setPermissions((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-muted mt-1'>No permissions added.</p>
        )}

        {addingPermission ? (
          <RolePermissionsTable
            selectedPermissions={permissions}
            onChange={setPermissions}
          />
        ) : (
          <Button
            type='button'
            variant='outline'
            className='mt-2'
            onClick={() => setAddingPermission(true)}
          >
            Add permission
          </Button>
        )}
      </div>

      <Separator />

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? <CustomLoading message='Saving...' /> : 'Save Rol'}
      </Button>
    </form>
  );
}
