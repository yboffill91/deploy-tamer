'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxWithAddProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onAddOption?: (option: ComboboxOption) => void;
  placeholder?: string;
  emptyText?: string;
  addNewText?: string;
  className?: string;
}

export function ComboboxWithAdd({
  options,
  value,
  onValueChange,
  onAddOption,
  placeholder = 'Seleccionar opción...',
  emptyText = 'No se encontraron resultados.',
  addNewText = 'Agregar',
  className,
}: ComboboxWithAddProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const selectedOption = options.find((option) => option.value === value);

  const handleAddNew = () => {
    if (searchValue.trim() && onAddOption) {
      const newOption: ComboboxOption = {
        value: searchValue.toLowerCase().replace(/\s+/g, '-'),
        label: searchValue.trim(),
      };
      onAddOption(newOption);
      onValueChange?.(newOption.value);
      setSearchValue('');
      setOpen(false);
    }
  };

  const showAddButton = searchValue.trim() && filteredOptions.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Buscar o escribir nueva opción...'
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredOptions.length === 0 && !showAddButton && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(
                        currentValue === value ? '' : currentValue
                      );
                      setOpen(false);
                      setSearchValue('');
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {showAddButton && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleAddNew}
                  className='text-primary cursor-pointer'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  {addNewText} &quot; {searchValue} &quot;
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
