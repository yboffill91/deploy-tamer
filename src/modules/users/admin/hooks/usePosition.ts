import { PositionManagementRepository } from '@/infraestructure/repositories/PositionManagementRepository';
import { PositionMockService } from '@/infraestructure/services/users';
import { useEffect, useState } from 'react';

export function usePositions() {
  const [positions, setPositions] = useState<
    { id: string; name: string; description?: string; roleIds: string[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const repository = new PositionManagementRepository();
  const mockService = new PositionMockService(repository);

  useEffect(() => {
    const load = async () => {
      await mockService.initialize();
      const all = await repository.findAll();

      // Mapear a objetos planos
      const uiPositions = all.map((p) => ({
        id: p.id,
        name: p.name.getValue(),
        description: p.description,
        roleIds: p.roleIds,
      }));

      setPositions(uiPositions);
      setLoading(false);
    };
    load();
  }, []);

  return {
    positions,
    loading,
    refresh: async () => {
      const all = await repository.findAll();
      const uiPositions = all.map((p) => ({
        id: p.id,
        name: p.name.getValue(),
        description: p.description,
        roleIds: p.roleIds,
      }));
      setPositions(uiPositions);
    },
  };
}
