'use client';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import { CustomLoading } from '@/components/CustomLoading';
import { showToast } from '@/components/CustomToaster';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { BrandsEntity, CompanyEntity } from '@/core/entities';
import { BrandApiRepository } from '@/infrastructure/repositories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import { z } from 'zod';

const BrandScheme = z.object({
  name: z.string().min(1, 'Name is required'),
  companyId: z.string().min(1, 'Company is required'),
});

type BrandsFormType = z.infer<typeof BrandScheme>;

interface Props {
  brand: CompanyEntity | null;
  companies: CompanyEntity[];
  editForm?: boolean;
  onComplete(): void;
}

export const BrandsForm = ({
  brand,
  companies,
  editForm = false,
  onComplete,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandsFormType>({
    resolver: zodResolver(BrandScheme),
    mode: 'onBlur',
    defaultValues:
      brand instanceof BrandsEntity
        ? {
            name: brand.name!,
            companyId: String(brand.id!),
          }
        : {
            name: '',
            companyId: '',
          },
  });

  const onSubmit = async (data: BrandsFormType) => {
    try {
      if (editForm) {
        const BRAND_REPO = new BrandApiRepository();
        await BRAND_REPO.update(String(brand!.id!), {
          ...data,
          companyId: Number(data.companyId),
        });
        showToast({
          message: 'Success',
          description: 'Brand updated successfully',
          type: 'success',
        });
        onComplete();
      } else {
        const BRAND_REPO = new BrandApiRepository();
        await BRAND_REPO.create({
          ...data,
          companyId: Number(data.companyId),
        });
        showToast({
          message: 'Success',
          description: 'Brand created successfully',
          type: 'success',
        });
        onComplete();
      }
      onComplete();
    } catch (error) {
      showToast({
        message: 'Error',
        description:
          'Error creating brand: ' +
          (error instanceof Error ? error.message : 'Unexpected Error'),
        type: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <CustomControllerInput
        name='name'
        label='Name'
        placeholder='Brand Name'
        control={control}
        error={errors.name}
      />
      <Controller
        name='companyId'
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a company' />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((c) => (
                <SelectItem key={c.id} value={String(c.id!)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.companyId && (
        <p className='text-destructive text-xs'>{errors.companyId.message}</p>
      )}

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <CustomLoading message='Submitting...' /> : 'Save'}
      </Button>
    </form>
  );
};
