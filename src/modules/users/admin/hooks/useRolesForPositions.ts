import { usePositions } from './usePosition';
import { useRoles } from './useRoles';

export function usePositionsWithRoles() {
  const { positions, loading: loadingPositions } = usePositions();
  const { roles, loading: loadingRoles } = useRoles();

  const enrichedPositions = positions.map((pos) => ({
    ...pos,
    roles: pos.roleIds
      .map((id) => roles.find((r) => r.id === id))
      .filter(Boolean),
  }));

  return {
    positions: enrichedPositions,
    loading: loadingPositions || loadingRoles,
  };
}
