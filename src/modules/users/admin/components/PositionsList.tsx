'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { GenericDataTable } from '@/components/GenericDataTable';
import { ControlledDialog } from '@/components/ControlledDialog';
import { usePositions } from '../hooks/usePosition';
import { useRoles } from '../hooks/useRoles';
import { PositionManagementRepository } from '@/infraestructure/repositories/PositionManagementRepository';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { AddPositionForm } from './PositionAddForm.tsx';

export const PositionList = () => {
  const { loading, positions, refresh } = usePositions();
  const { roles } = useRoles();
  const repository = useMemo(() => new PositionManagementRepository(), []);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<string | null>(null);

  // Map de id => nombre del rol
  const roleMap = useMemo(() => {
    const map: Record<string, string> = {};
    roles.forEach((r) => (map[r.id] = r.name));
    return map;
  }, [roles]);

  // Datos para la tabla: roles mostrados por nombre
  const tableData = useMemo(() => {
    return positions.map((pos) => ({
      ...pos,
      roles: pos.roleIds.map((id) => roleMap[id] ?? id).join(', '), // columna de roles con nombres
    }));
  }, [positions, roleMap]);

  const manageDelete = async () => {
    if (!positionToDelete) return;
    try {
      await repository.delete(positionToDelete);
      toast.success('Position deleted successfully');
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error deleting position'
      );
    } finally {
      setShowConfirm(false);
      setPositionToDelete(null);
    }
  };

  const manageEdit = (positionId: string) => {
    router.push(`/admin/positions-management/${positionId}`);
  };

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <div className='my-6 flex items-center justify-end'>
            <Button onClick={() => setShowModal(true)}>Add New</Button>
          </div>
          <GenericDataTable
            data={tableData} // usamos la versión "pulida" con nombres
            onDelete={(item) => {
              setPositionToDelete(item.id);
              setShowConfirm(true);
            }}
            onEdit={(item) => manageEdit(item.id)}
            showAddButton
            onAdd={() => setShowModal(true)}
          />

          <ControlledDialog
            open={showModal}
            onOpenChange={setShowModal}
            title='Add new Position'
          >
            <AddPositionForm />
          </ControlledDialog>

          <ControlledDialog
            open={showConfirm}
            onOpenChange={setShowConfirm}
            title='Confirm delete'
          >
            <div className='space-y-4'>
              <p>Are you sure you want to delete this position?</p>
              <div className='flex justify-end gap-2'>
                <Button onClick={manageDelete} variant='destructive'>
                  <Trash2 /> Delete
                </Button>
                <Button onClick={() => setShowConfirm(false)} variant='outline'>
                  Cancel
                </Button>
              </div>
            </div>
          </ControlledDialog>
        </>
      )}
    </>
  );
};
