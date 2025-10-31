'use client';

import { useEffect, useState } from 'react';
import { RoleManagementRepository } from '@/infraestructure/repositories/RoleManagementRepository';
import { RoleMockService } from '@/infraestructure/services/users/RoleMockService';
import { RoleDTO } from '@/core';

export function useRoles() {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const repository = new RoleManagementRepository();
  const mockService = new RoleMockService(repository);

  useEffect(() => {
    const load = async () => {
      await mockService.initialize();
      const all = await repository.findAll();

      const uiRoles = all.map((r) => ({
        id: r.id,
        name: r.name.getValue(),
        permissions: r.permissions ?? [],
      }));

      setRoles(uiRoles);
      setLoading(false);
    };
    load();
  }, []);

  return {
    roles,
    loading,
    refresh: async () => {
      const all = await repository.findAll();
      const uiRoles = all.map((r) => ({
        id: r.id,
        name: r.name.getValue(),
        permissions: r.permissions ?? [],
      }));
      setRoles(uiRoles);
    },
  };
}
