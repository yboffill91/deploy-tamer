'use client';

import { GenericDataTable } from '@/components/GenericDataTable';
import { useRoles } from '../hooks/useRoles';
import { RoleManagementRepository } from '@/infraestructure/repositories/RoleManagementRepository';
import { toast } from 'sonner';
import { useState } from 'react';
import { ControlledDialog } from '@/components/ControlledDialog';
import { RolesAddForm } from './RolesAddForm';
import { Button } from '@/components/ui';
import { Role } from '@/core';
import { RoleEditForm } from './RoleEditForm';
import { Trash2 } from 'lucide-react';

export const RoleList = () => {
  const { loading, roles, refresh } = useRoles();
  const repository = new RoleManagementRepository();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const manageEdit = async (roleId: string) => {
    const role = await repository.findById(roleId);
    if (!role) return;
    setSelectedRole(role);
    setShowEdit(true);
  };

  const manageDelete = async () => {
    if (!roleToDelete) return;
    try {
      await repository.delete(roleToDelete);
      toast.success('Role deleted successfully');
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error deleting position'
      );
    } finally {
      setConfirm(false);
      setRoleToDelete(null);
    }
  };

  const manageAdd = () => setShowModal(true);

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <GenericDataTable
            data={roles}
            onDelete={(role) => {
              setRoleToDelete(role.id);
              setConfirm(true);
            }}
            excludeColumns={['id']}
            showAddButton
            onAdd={manageAdd}
            onEdit={(item) => manageEdit(item.id)}
          />
          <ControlledDialog
            open={showModal}
            onOpenChange={setShowModal}
            title='Add New Role'
          >
            <RolesAddForm onSuccess={refresh} />
          </ControlledDialog>
          <ControlledDialog
            open={showEdit}
            onOpenChange={setShowEdit}
            title={`Edit role ${selectedRole?.name}`}
          >
            <RoleEditForm roleId={selectedRole?.id ?? ' '} />
          </ControlledDialog>
          <ControlledDialog
            open={confirm}
            onOpenChange={setConfirm}
            title='Confirm delete'
          >
            <div className='space-y-4'>
              <p className='mb-4'>Are you sure you want to delete this role?</p>
              <div className='flex justify-end gap-2'>
                <Button onClick={manageDelete} variant={'destructive'}>
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </ControlledDialog>
        </>
      )}
      <div className='mt-6 flex items-center justify-end'>
        <Button onClick={() => setShowModal(true)}>Add New</Button>
      </div>
    </>
  );
};
