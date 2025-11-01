'use client';

import { UserManagementRepository } from '@/infraestructure/repositories';
import { useUsers } from '../hooks/useUser';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { GenericDataTable } from '@/components/GenericDataTable';
import { ControlledDialog } from '@/components/ControlledDialog';
import { Trash2 } from 'lucide-react';
import { UserAddForm } from './UserAddForm';

export const UserList = () => {
  const { users, loading, refresh } = useUsers();
  const repository = useMemo(() => new UserManagementRepository(), []);
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const tableData = useMemo(() => users, [users]);

  const manageDelete = async () => {
    if (!userToDelete) return;
    try {
      await repository.delete(userToDelete);
      toast.success('User deleted successfully');
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error deleting user'
      );
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const manageEdit = (userId: string) => {
    router.push(`/admin/users/${userId}`);
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
            data={tableData}
            onDelete={(item) => {
              setUserToDelete(item.id);
              setShowConfirm(true);
            }}
            onEdit={(item) => manageEdit(item.id)}
            showAddButton
            onAdd={() => setShowModal(true)}
          />

          <ControlledDialog
            open={showModal}
            onOpenChange={setShowModal}
            title='Add new User'
          >
            <UserAddForm />
          </ControlledDialog>

          <ControlledDialog
            open={showConfirm}
            onOpenChange={setShowConfirm}
            title='Confirm delete'
          >
            <div className='space-y-4'>
              <p>Are you sure you want to delete this user?</p>
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
