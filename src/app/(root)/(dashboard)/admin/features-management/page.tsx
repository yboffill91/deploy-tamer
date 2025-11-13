'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Sliders } from 'lucide-react';
import { FunctionalitiesEntity, requestFunctionalitiesDTO } from '@/core';

import { CustomLoading } from '@/components/CustomLoading';
import { FunctionalitiesDataTable } from '@/modules/users/admin/components';
import { FunctionalitiesApiRepository } from '@/infraestructure/repositories';
import { CustomEmpty } from '@/components/CustomEmpty';
import { ControlledDialog } from '@/components/ControlledDialog';
import { CommonHeader } from '@/modules/users/admin';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';

export default function FunctionalitiesPage() {
  const [functionalities, setFunctionalities] = useState<
    FunctionalitiesEntity[] | null
  >(null);
  const [editingFunctionality, setEditingFunctionality] =
    useState<FunctionalitiesEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<requestFunctionalitiesDTO>({
    name: '',
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [funcToDelete, setFuncToDelete] =
    useState<FunctionalitiesEntity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useState<FunctionalitiesEntity | null>(null);

  const func_repo = new FunctionalitiesApiRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const data = await func_repo.findAll();
        console.log(data);
        setFunctionalities(data);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (isError) {
      showToast({
        message: 'Error',
        type: 'error',
        description: isError,
      });
    }
  }, [isError]);

  const handleAddFunctionality = () => {
    setEditingFunctionality(null);
    setFormData({ name: '' });
    setIsDialogOpen(true);
  };

  const handleEditFunctionality = (functionality: FunctionalitiesEntity) => {
    setEditingFunctionality(functionality);
    setFormData({ name: functionality.name });
    setIsDialogOpen(true);
  };

  const handleDelete = (functionality: FunctionalitiesEntity) => {
    setFuncToDelete(functionality);
    setConfirmDelete(true);
  };

  const confirm = async () => {
    if (!funcToDelete) {
      setIsError('Nothing to delete');
      return;
    }

    try {
      setIsDeleting(true);
      await func_repo.delete(String(funcToDelete.id));
      showToast({
        message: 'Success',
        type: 'success',
        description: `Functionality "${funcToDelete.name}" deleted successfully`,
      });
      const func = await func_repo.findAll();
      if (func.length === 0) {
        setFunctionalities(null);
      }
      setFunctionalities(func);
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : `Error Deleting Role ${funcToDelete.name}`
      );
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
      setFuncToDelete(null);
    }
  };

  const handleSaveFunctionality = async () => {
    if (!formData.name!.trim()) {
      alert('Functionality name is required');
      return;
    }

    if (editingFunctionality) {
      try {
        setIsUpdating(true);
        await func_repo.update(editingFunctionality.id!.toString(), formData);
        setIsUpdating(false);
        const func = await func_repo.findAll();
        setFunctionalities(func);
        showToast({
          message: 'Success',
          type: 'success',
          description: 'Functionality updated successfully',
        });
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      } finally {
        setIsUpdating(false);
        setIsDialogOpen(false);
      }
    } else {
      try {
        setIsCreating(true);
        await func_repo.create(formData);
        const func = await func_repo.findAll();
        setFunctionalities(func);
        showToast({
          message: 'Success',
          type: 'success',
          description: 'Functionality created successfully',
        });
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      } finally {
        setIsCreating(false);
        setIsDialogOpen(false);
      }
    }

    setIsDialogOpen(false);
    setFormData({ name: '' });
  };

  return (
    <>
      {isLoading && (
        <CustomPageLoader message='Loading Functionalities data...' />
      )}
      {!isLoading && functionalities && functionalities.length && (
        <div className=''>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <CommonHeader
                icon={Sliders}
                title={'Functionalities Management'}
                desc={'Manage the functionalities available in the system'}
              />
            </div>

            <Card>
              <CardContent>
                {
                  <FunctionalitiesDataTable
                    data={functionalities}
                    onEdit={handleEditFunctionality}
                    onDelete={handleDelete}
                    onAdd={handleAddFunctionality}
                  />
                }
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading &&
        (functionalities === null || functionalities.length === 0) && (
          <CustomEmpty
            title='No functionalities created yet'
            description='Create a new functionality'
            icon={AlertTriangle}
            onClick={handleAddFunctionality}
          />
        )}
      <>
        <ControlledDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={
            editingFunctionality
              ? 'Edit Functionality'
              : 'Create New Functionality'
          }
          description={
            editingFunctionality
              ? 'Update the functionality name'
              : 'Create a new functionality that can be assigned to roles'
          }
        >
          <div className='space-y-4'>
            <div>
              <Label
                htmlFor='functionality-name'
                className='text-sm font-medium'
              >
                Functionality Name
              </Label>
              <Input
                id='functionality-name'
                placeholder='e.g., Reports, Analytics, Settings'
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className='mt-2'
              />
            </div>

            <div className='flex justify-end gap-3'>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFunctionality}>
                {isUpdating ? (
                  <CustomLoading message='Updating Functionality' />
                ) : isCreating ? (
                  <CustomLoading message='Creating Functionality' />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </ControlledDialog>
        <ControlledDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title='Confirm Delete'
          description={`Are you sure you want to delete the functionality ${funcToDelete?.name}? This action cannot be undone.`}
        >
          <div className='flex justify-end gap-3 mt-4'>
            <Button variant='outline' onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirm}>
              {isDeleting ? <CustomLoading message='Deleting' /> : 'Delete'}
            </Button>
          </div>
        </ControlledDialog>
      </>
    </>
  );
}
