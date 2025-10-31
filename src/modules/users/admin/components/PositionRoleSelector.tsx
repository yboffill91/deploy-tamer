'use client';

import { RoleDTO } from '@/core';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRoles } from '../hooks/useRoles';

interface Props {
  selectedRoleIds: string[];
  onChange: (roleIds: string[]) => void;
}

export const PositionRolesSelector = ({ selectedRoleIds, onChange }: Props) => {
  const { roles, loading } = useRoles();
  const [selected, setSelected] = useState<string[]>(selectedRoleIds);

  useEffect(() => {
    setSelected(selectedRoleIds);
  }, [selectedRoleIds]);

  const toggleRole = (role: RoleDTO) => {
    const newSelected = selected.includes(role.id)
      ? selected.filter((id) => id !== role.id)
      : [...selected, role.id];
    setSelected(newSelected);
    onChange(newSelected);
  };

  if (loading) return <p>Loading roles...</p>;

  return (
    <div className='flex flex-col gap-2'>
      <Label>Assign Roles</Label>
      <div className='flex flex-col gap-1'>
        {roles.map((role) => (
          <div key={role.id} className='flex items-center gap-2'>
            <Checkbox
              checked={selected.includes(role.id)}
              onCheckedChange={() => toggleRole(role)}
            />
            <span className='text-sm'>{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
