'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { useFeatures } from '../hooks/useFeatures';

type AccessLevel = 'read' | 'write' | 'full';

interface RolePermissionsTableProps {
  selectedPermissions: { feature: string; access: AccessLevel }[];
  onChange: (updated: { feature: string; access: AccessLevel }[]) => void;
}

export const RolePermissionsTable = ({
  selectedPermissions,
  onChange,
}: RolePermissionsTableProps) => {
  const { features, loading } = useFeatures();
  const [open, setOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  if (loading) return <p>Loading features...</p>;

  // helper: verifica si una feature tiene cierto access
  const hasAccess = (feature: string, access: AccessLevel) =>
    selectedPermissions.some(
      (p) => p.feature === feature && p.access === access
    );

  const toggleAccess = (feature: string, access: AccessLevel) => {
    const exists = hasAccess(feature, access);
    let updated: { feature: string; access: AccessLevel }[];

    if (exists) {
      updated = selectedPermissions.filter(
        (p) => !(p.feature === feature && p.access === access)
      );
    } else {
      updated = [...selectedPermissions, { feature, access }];
    }
    onChange(updated);
  };

  const addFeature = (featureCode: string) => {
    if (!features.find((f) => f.code === featureCode)) return;
    setSelectedFeature(null);
    setOpen(false);
  };

  return (
    <div className='space-y-4'>
      {/* Combobox para agregar feature */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-60 justify-between'
          >
            {selectedFeature
              ? features.find((f) => f.code === selectedFeature)?.name
              : 'Add feature...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-60 p-0'>
          <Command>
            <CommandInput placeholder='Search feature...' />
            <CommandEmpty>No feature found.</CommandEmpty>
            <CommandGroup>
              {features.map((f) => (
                <CommandItem
                  key={f.id}
                  onSelect={() => {
                    addFeature(f.code);
                  }}
                >
                  {f.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Tabla de permisos */}
      <div className='border rounded-lg overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-muted text-muted-foreground'>
            <tr>
              <th className='text-left p-2'>Feature</th>
              <th className='text-center p-2'>Read</th>
              <th className='text-center p-2'>Write</th>
              <th className='text-center p-2'>Full</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.id} className='border-t'>
                <td className='p-2 font-medium'>{f.name}</td>
                {(['read', 'write', 'full'] as AccessLevel[]).map((access) => (
                  <td key={access} className='text-center p-2'>
                    <Checkbox
                      checked={hasAccess(f.code, access)}
                      onCheckedChange={() => toggleAccess(f.code, access)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
