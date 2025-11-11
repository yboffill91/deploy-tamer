'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  buildRolesCascadeDTO,
  FunctionalitiesEntity,
  RolesEntity,
} from '@/core';
import {
  CommonHeader,
  FeaturesManager,
  RoleFeature,
  RolesDataTable,
} from '@/modules/users/admin';
import {
  FunctionalitiesApiRepository,
  RolesApiRepository,
} from '@/infraestructure/repositories';
import toast from 'react-hot-toast';
import { CustomLoading } from '@/components/CustomLoading';
import { CustomEmpty } from '@/components/CustomEmpty';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CustomPageLoader } from '@/components/CustomPageLoader';

export default function RolesPage() {
  const [roles, setRoles] = useState<RolesEntity[] | null>(null);
  const [functionalities, setFunctionalities] = useState<
    FunctionalitiesEntity[] | null
  >(null);
  const [editingRole, setEditingRole] = useState<RolesEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<buildRolesCascadeDTO>({
    name: '',
    feature: [],
  });

  const [isError, setIsError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [roleToDelete, setRoleToDelete] = useState<RolesEntity | null>(null);
  const [confirm, setConfirm] = useState(false);

  const roles_repo = new RolesApiRepository();
  const func_repo = new FunctionalitiesApiRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const roles_data = await roles_repo.findAll();
        const func_data = await func_repo.findAll();
        setRoles(roles_data);
        setFunctionalities(func_data);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error fetching data'
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(isError);
      setIsError(null);
    }
  }, [isError]);

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({ name: '', feature: [] });
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: RolesEntity) => {
    setEditingRole(role);
    setFormData({
      name: role.name!,
      feature: role.roleFunctionality!.map((f) => ({
        functionalityId: f.id!,
        mode: f.mode!,
      })),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (role: RolesEntity) => {
    setRoleToDelete(role);
    setConfirm(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) {
      setIsError('Nothing to delete');
      return;
    }

    try {
      setIsDeleting(true);
      await roles_repo.delete(String(roleToDelete.id));
      toast.success(`Role "${roleToDelete.name}" deleted successfully`);
      const roles = await roles_repo.findAll();
      setRoles(roles);
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : `Error Deleting Role ${roleToDelete.name}`
      );
    } finally {
      setIsDeleting(false);
      setConfirm(false);
      setRoleToDelete(null);
    }
  };
  const handleSaveRole = async () => {
    if (!formData.name!.trim()) {
      setIsError('Role name is required');
      return;
    }

    if (editingRole) {
      if (!roles) {
        setIsError('No roles data');
        return;
      }
      try {
        setIsUpdating(true);
        await roles_repo.update(editingRole.id!.toString(), formData);
        const newRoles = await roles_repo.findAll();
        toast.success('Role Updated');
        setRoles(newRoles);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error updating role'
        );
      } finally {
        setIsUpdating(false);
        setIsDialogOpen(false);
      }
    } else {
      try {
        setIsCreating(true);
        await roles_repo.create(formData);
        const newRoles = await roles_repo.findAll();
        toast.success('New Role Added');
        setRoles(newRoles);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error creating role'
        );
      } finally {
        setIsCreating(false);
        setIsDialogOpen(false);
      }
    }

    setIsDialogOpen(false);
    setFormData({ name: '', feature: [] });
  };

  return (
    <>
      {isLoading && (
        <CustomPageLoader message='Loading Roles and Features data ...' />
      )}
      {roles && (
        <div>
          <div className='space-y-6 container '>
            <div className='flex items-center justify-between'>
              <CommonHeader
                icon={ShieldCheck}
                title={'Roles Management'}
                desc={'Manage roles and assign permissions to features'}
              />

              <ControlledDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={editingRole ? 'Edit Role' : 'Create New Role'}
                description={
                  editingRole
                    ? 'Update the role details and permissions'
                    : 'Create a new role and assign permissions'
                }
              >
                <div className='space-y-6'>
                  <div>
                    <Label htmlFor='role-name' className='text-sm font-medium'>
                      Role Name
                    </Label>
                    <Input
                      id='role-name'
                      placeholder='e.g., Administrator, Editor, Viewer'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='mt-2'
                    />
                  </div>

                  <div>
                    <Label className='text-sm font-medium mb-3 block'>
                      Permissions
                    </Label>
                    {functionalities && (
                      <FeaturesManager
                        availableFeatures={functionalities}
                        selectedFeatures={formData.feature! as RoleFeature[]}
                        onFeaturesChange={(features) =>
                          setFormData({ ...formData, feature: features })
                        }
                      />
                    )}
                  </div>

                  <div className='flex justify-end gap-3'>
                    <Button
                      variant='outline'
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveRole}>
                      {isCreating ? (
                        <CustomLoading message='Creatind Role' />
                      ) : isUpdating ? (
                        <CustomLoading message='Updating Role' />
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                </div>
              </ControlledDialog>
              <ControlledDialog
                open={confirm}
                onOpenChange={setConfirm}
                title='Confirm Delete'
                description={`Are you sure you want to delete the role ${roleToDelete?.name}? This action cannot be undone.`}
              >
                <div className='flex justify-end gap-3 mt-4'>
                  <Button variant='outline' onClick={() => setConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant='destructive' onClick={confirmDelete}>
                    {isDeleting ? (
                      <CustomLoading message='Deleting Role' />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </ControlledDialog>
            </div>

            <Card>
              <CardContent>
                <RolesDataTable
                  data={roles}
                  onEdit={(role) => handleEditRole(role)}
                  onDelete={(role) => handleDelete(role)}
                  onAdd={handleAddRole}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && (!roles || roles.length === 0) && (
        <CustomEmpty
          title='No data yet'
          description="We don't found any data yet, but you can create a new one"
          onClick={handleAddRole}
          icon={AlertTriangle}
        />
      )}
    </>
  );
}
