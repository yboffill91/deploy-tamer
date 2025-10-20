'use client';

import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  type?: string;
  tabindex?: number;
}

export const CustomInput = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  register,
  error,
  type = 'text',
  tabindex,
}: Props<TFieldValues>) => {
  return (
    <div className='p-1 flex items-start gap-1 flex-col w-full  min-h-[5.2rem]'>
      <Label
        htmlFor={name}
        className={cn(
          'font-semibold text-foreground',
          error && 'text-destructive'
        )}
      >
        {label}:
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        tabIndex={tabindex}
        className={cn(
          'bg-primary/10 rounded',
          error &&
            'bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive'
        )}
        {...register(name)}
      />

      <div className=' w-full'>
        {error && (
          <div>
            <div className='flex  text-xs item-center gap-1 text-destructive line-clamp-2  font-semibold'>
              <AlertCircle className='w-3 h-4' />
              {error.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
