'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  Eye,
  Box,
  LayoutGrid,
  ImageIcon,
  Heading,
  Type,
  Link,
  RectangleVertical,
  RectangleHorizontal,
  MousePointer2,
  Minus,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { COMPONENT_METADATA, EmailComponent } from '@/lib/mailer-react-code/email-types';
import { removeComponent } from '@/lib/mailer-react-code/emails-utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Box,
  LayoutGrid,
  Image: ImageIcon,
  Heading,
  Type,
  Link,
  RectangleVertical,
  RectangleHorizontal,
  MousePointer2,
  Minus,
};

interface ComponentNodeProps {
  component: EmailComponent;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (components: EmailComponent[]) => void;
  components: EmailComponent[];
  level: number;
}

export function ComponentNode({
  component,
  selectedId,
  onSelect,
  onUpdate,
  components,
  level,
}: ComponentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const metadata = COMPONENT_METADATA[component.type];
  const Icon = ICON_MAP[metadata.icon];
  const isSelected = selectedId === component.id;
  const hasChildren =
    'children' in component &&
    component.children &&
    component.children.length > 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeComponent(components, component.id);
    onUpdate(updated);
    if (selectedId === component.id) {
      onSelect(null);
    }
  };

  const getComponentLabel = () => {
    const baseName = metadata.label;

    // Show content preview for text-based components
    if ('content' in component && typeof component.content === 'string') {
      const preview = component.content.slice(0, 30);
      return `${baseName}: ${preview}${
        component.content.length > 30 ? '...' : ''
      }`;
    }

    if (component.type === 'img' && 'alt' in component) {
      return `${baseName}: ${component.alt}`;
    }

    if (component.type === 'button' && 'content' in component) {
      return `${baseName}: ${component.content}`;
    }

    return baseName;
  };

  return (
    <div className='relative'>
      <div
        className={cn(
          'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors',
          'hover:bg-accent/50',
          isSelected &&
            'bg-primary/20 hover:bg-primary/30 border border-primary',
          !isSelected && 'border border-transparent'
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(component.id)}
      >
        {hasChildren && (
          <Button
            variant='ghost'
            size='icon'
            className='h-5 w-5 p-0 hover:bg-transparent'
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
                      }}
                      type='button'
          >
            <ChevronRight
              className={cn(
                'h-3 w-3 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </Button>
        )}

        {!hasChildren && <div className='w-5' />}

        {Icon && (
          <Icon
            className={cn(
              'h-4 w-4 shrink-0',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        )}

        <span
          className={cn(
            'flex-1 text-sm truncate',
            isSelected ? 'text-foreground font-medium' : 'text-foreground'
          )}
        >
          {getComponentLabel()}
        </span>

        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive'
                  onClick={handleDelete}
                  type='button'
        >
          <Trash2 className='h-3 w-3' />
        </Button>
      </div>

      {hasChildren && isExpanded && 'children' in component && (
        <div className='mt-1'>
          {component.children?.map((child) => (
            <ComponentNode
              key={child.id}
              component={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onUpdate={onUpdate}
              components={components}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
