'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { UserDTO } from '@/core/dto';
import { UserManagementRepository } from '@/infraestructure/repositories/ManageUsersRepository';
import { UserSeedService } from '@/infraestructure/services/users/UserMockService';

export function useUsers() {
  const [users, setUsers] = useState<Omit<UserDTO, 'photoUrl'>[]>([]);
  const [loading, setLoading] = useState(true);

  const repository = useMemo(() => new UserManagementRepository(), []);
  const seedService = useMemo(
    () => new UserSeedService(repository),
    [repository]
  );

  const loadUsers = useCallback(async () => {
    const data = await repository.findAll();
    // Eliminamos photoUrl antes de exponer los datos
    const transformed = data.map(({ photoUrl, ...rest }) => rest);
    setUsers(transformed);
  }, [repository]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await seedService.seed();
      await loadUsers();
      setLoading(false);
    };

    initialize();
  }, [seedService, loadUsers]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadUsers();
    setLoading(false);
  }, [loadUsers]);

  return {
    users,
    loading,
    refresh,
  };
}
