'use client';

import type React from 'react';



import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  LayoutGrid,
  ImageIcon,
  Heading,
  Type,
  Link,
  RectangleVertical,
  RectangleHorizontal,
  MousePointer2,
  Minus,
} from 'lucide-react';
import { COMPONENT_METADATA, ComponentType, EmailComponent } from '@/lib/mailer-react-code/email-types';
import { addComponentToParent, canAddComponent, createComponent } from '@/lib/mailer-react-code/emails-utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  ImageIcon,
  Heading,
  Type,
  Link,
  RectangleVertical,
  RectangleHorizontal,
  MousePointer2,
  Minus,
};

interface ComponentLibraryProps {
  components: EmailComponent[];
  onAddComponent: (components: EmailComponent[]) => void;
  selectedId: string | null;
}

export function ComponentLibrary({
  components,
  onAddComponent,
  selectedId,
}: ComponentLibraryProps) {
  const handleAddComponent = (type: ComponentType) => {
    const newComponent = createComponent(type);

    // If no component is selected, add to root (only sections allowed)
    if (!selectedId) {
      if (canAddComponent(type, undefined)) {
        onAddComponent([...components, newComponent]);
      }
      return;
    }

    // Find the selected component and check if we can add as child
    const findComponentType = (
      comps: EmailComponent[],
      id: string
    ): ComponentType | null => {
      for (const comp of comps) {
        if (comp.id === id) return comp.type;
        if ('children' in comp && comp.children) {
          const found = findComponentType(comp.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const parentType = findComponentType(components, selectedId);
    if (parentType && canAddComponent(type, parentType)) {
      const updated = addComponentToParent(
        components,
        selectedId,
        newComponent
      );
      onAddComponent(updated);
    }
  };

  const layoutComponents: ComponentType[] = ['section', 'row', 'column'];
  const contentComponents: ComponentType[] = [
    'heading',
    'text',
    'button',
    'link',
    'img',
    'hr',
  ];

  const renderComponentButton = (type: ComponentType) => {
    const metadata = COMPONENT_METADATA[type];
    const Icon = ICON_MAP[metadata.icon];

    return (
      <Button
        key={type}
        variant='outline'
        className='w-full justify-start gap-3 h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground bg-transparent'
        onClick={() => handleAddComponent(type)}
        type='button'
      >
        {Icon && <Icon className='h-4 w-4 shrink-0 text-primary' />}
        <div className='flex flex-col items-start gap-0.5'>
          <span className='font-medium text-sm'>{metadata.label}</span>
          <span className='text-xs text-muted-foreground'>
            {metadata.description}
          </span>
        </div>
      </Button>
    );
  };

  return (
    <div className='p-4 space-y-6'>
      <div>
        <h2 className='text-sm font-semibold text-foreground mb-3'>Layout</h2>
        <div className='space-y-2'>
          {layoutComponents.map(renderComponentButton)}
        </div>
      </div>

      <div>
        <h2 className='text-sm font-semibold text-foreground mb-3'>Content</h2>
        <div className='space-y-2'>
          {contentComponents.map(renderComponentButton)}
        </div>
      </div>

      <Card className='p-4 bg-muted/50 border-primary/20'>
        <p className='text-xs text-muted-foreground leading-relaxed'>
          Sections are independent containers. Each can have Rows, which contain
          Columns or content components.
        </p>
      </Card>
    </div>
  );
}
