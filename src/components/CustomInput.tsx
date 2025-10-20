'use client';

import { useState } from 'react';
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  AlertCircle,
  Asterisk,
  Eye,
  EyeOff,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group';

interface Props<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  type?: string;
  tabindex?: number;
  addon?: LucideIcon;
}

export const CustomInput = <TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  register,
  error,
  type = 'text',
  tabindex,
  addon,
}: Props<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className='p-1 flex items-start gap-1 flex-col w-full min-h-[5.2rem]'>
      <Label
        htmlFor={name}
        className={cn(
          'font-semibold text-foreground',
          error && 'text-destructive'
        )}
      >
        {label}:
      </Label>

      {isPasswordField ? (
        <InputGroup
          className={cn(
            'bg-input',
            error &&
              'bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive'
          )}
        >
          <InputGroupInput
            id={name}
            type={inputType}
            placeholder={placeholder}
            tabIndex={tabindex}
            aria-invalid={!!error}
            {...register(name)}
          />
          <InputGroupAddon>
            <Asterisk className={cn(error && 'text-destructive/50')} />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              size='icon-xs'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Show Password' : 'Hide Password'}
              className={cn(error && 'text-destructive/50')}
            >
              {showPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : addon ? (
        <InputGroup
          className={cn(
            'bg-input',
            error &&
              'bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive'
          )}
        >
          <InputGroupInput
            id={name}
            type={type}
            placeholder={placeholder}
            tabIndex={tabindex}
            aria-invalid={!!error}
            {...register(name)}
          />
          <InputGroupAddon>
            {addon &&
              (() => {
                const AddonIcon = addon;
                return (
                  <AddonIcon className={cn(error && 'text-destructive/50')} />
                );
              })()}
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          tabIndex={tabindex}
          className={cn(
            'bg-input rounded',
            error &&
              'bg-destructive/5 border-destructive/20 placeholder:text-destructive/40 text-destructive'
          )}
          {...register(name)}
        />
      )}

      <div className='w-full'>
        {error && (
          <div>
            <div className='flex text-xs item-center gap-1 text-destructive line-clamp-2 font-semibold'>
              <AlertCircle className='w-3 h-4' />
              {error.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
