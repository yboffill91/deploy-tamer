'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

import { RoleManagementRepository } from '@/infraestructure/repositories/RoleManagementRepository';
import { Role, RolePermission } from '@/core';
import { AccessLevel, RoleName } from '@/core/value-objects';
import { CustomInput } from '@/components/CustomInput';
import { CustomLoading } from '@/components/CustomLoading';
import { RoleFormData, RoleSchema } from './models';
import { RolePermissionsTable } from './RolePermisionTable';

interface Props {
  roleId: string;
  onSuccess?: () => void;
}

export function RoleEditForm({ roleId, onSuccess }: Props) {
  const repository = new RoleManagementRepository();
  const [loadingRole, setLoadingRole] = useState(true);
  const [permissions, setPermissions] = useState<
    { feature: string; access: AccessLevel }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    const loadRole = async () => {
      const role = await repository.findById(roleId);
      if (role) {
        reset({ name: role.name.getValue() });
        setPermissions(
          role.permissions.map((p) => ({
            feature: p.feature,
            access: p.access,
          }))
        );
      }
      setLoadingRole(false);
    };
    loadRole();
  }, [roleId, reset]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      const updatedRole = new Role(
        roleId,
        new RoleName(data.name),
        permissions.map((p) => new RolePermission(p.feature, p.access))
      );

      await repository.save(updatedRole);
      toast.success('Role updated successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating role');
    }
  };

  if (loadingRole) return <CustomLoading message='Loading role...' />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
      <CustomInput
        label='Role Name'
        name='name'
        placeholder='Enter role name'
        register={register}
        error={errors.name}
      />

      <Separator />

      <div>
        <label className='block font-semibold'>Permissions</label>

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
          <p className='text-sm text-muted mt-1'>No permissions assigned.</p>
        )}

        <RolePermissionsTable
          selectedPermissions={permissions}
          onChange={setPermissions}
        />
      </div>

      <Separator />

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? <CustomLoading message='Saving...' /> : 'Save Role'}
      </Button>
    </form>
  );
}
