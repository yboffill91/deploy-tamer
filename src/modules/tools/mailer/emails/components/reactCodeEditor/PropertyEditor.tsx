'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { COMPONENT_METADATA, EmailComponent } from '@/lib/mailer-react-code/email-types';
import { findComponent, updateComponent } from '@/lib/mailer-react-code/emails-utils';

interface PropertyEditorProps {
  components: EmailComponent[];
  selectedId: string | null;
  onUpdate: (components: EmailComponent[]) => void;
}

export function PropertyEditor({
  components,
  selectedId,
  onUpdate,
}: PropertyEditorProps) {
  if (!selectedId) {
    return (
      <div className='p-6 h-full flex items-center justify-center'>
        <div className='text-center max-w-xs'>
          <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3'>
            <Settings className='h-6 w-6 text-muted-foreground' />
          </div>
          <h3 className='text-sm font-medium text-foreground mb-1'>
            No Component Selected
          </h3>
          <p className='text-xs text-muted-foreground'>
            Select a component from the tree to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const component = findComponent(components, selectedId);

  if (!component) {
    return (
      <div className='p-6'>
        <p className='text-sm text-muted-foreground'>Component not found</p>
      </div>
    );
  }

  const metadata = COMPONENT_METADATA[component.type];

  const handleUpdate = (updates: Partial<EmailComponent>) => {
    const updated = updateComponent(components, selectedId, updates);
    onUpdate(updated);
  };

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-foreground mb-1'>
          {metadata.label}
        </h2>
        <p className='text-xs text-muted-foreground'>{metadata.description}</p>
      </div>

      <div className='space-y-4'>
        {/* Common Properties */}
        <div>
          <Label
            htmlFor='className'
            className='text-sm font-medium text-foreground'
          >
            Tailwind Classes
          </Label>
          <Input
            id='className'
            value={component.className || ''}
            onChange={(e) => handleUpdate({ className: e.target.value })}
            placeholder='e.g., text-center mt-4 px-8'
            className='mt-1.5'
          />
          <p className='text-xs text-muted-foreground mt-1'>
            Add Tailwind CSS utility classes
          </p>
        </div>

        {/* Component-specific Properties */}
        {component.type === 'heading' && 'content' in component && (
          <>
            <div>
              <Label
                htmlFor='content'
                className='text-sm font-medium text-foreground'
              >
                Heading Text
              </Label>
              <Input
                id='content'
                value={component.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                placeholder='Your heading...'
                className='mt-1.5'
              />
            </div>
            
          </>
        )}

        {component.type === 'text' && 'content' in component && (
          <div>
            <Label
              htmlFor='content'
              className='text-sm font-medium text-foreground'
            >
              Text Content
            </Label>
            <Textarea
              id='content'
              value={component.content}
              onChange={(e) => handleUpdate({ content: e.target.value })}
              placeholder='Your paragraph text...'
              rows={4}
              className='mt-1.5'
            />
          </div>
        )}

        {component.type === 'link' && (
          <>
            {'content' in component && (
              <div>
                <Label
                  htmlFor='content'
                  className='text-sm font-medium text-foreground'
                >
                  Link Text
                </Label>
                <Input
                  id='content'
                  value={component.content}
                  onChange={(e) => handleUpdate({ content: e.target.value })}
                  placeholder='Click here'
                  className='mt-1.5'
                />
              </div>
            )}
            {'href' in component && (
              <div>
                <Label
                  htmlFor='href'
                  className='text-sm font-medium text-foreground'
                >
                  URL
                </Label>
                <Input
                  id='href'
                  value={component.href}
                  onChange={(e) => handleUpdate({ href: e.target.value })}
                  placeholder='https://example.com'
                  className='mt-1.5'
                />
              </div>
            )}
          </>
        )}

        {component.type === 'button' && (
          <>
            {'content' in component && (
              <div>
                <Label
                  htmlFor='content'
                  className='text-sm font-medium text-foreground'
                >
                  Button Text
                </Label>
                <Input
                  id='content'
                  value={component.content}
                  onChange={(e) => handleUpdate({ content: e.target.value })}
                  placeholder='Click me'
                  className='mt-1.5'
                />
              </div>
            )}
            {'href' in component && (
              <div>
                <Label
                  htmlFor='href'
                  className='text-sm font-medium text-foreground'
                >
                  Button URL
                </Label>
                <Input
                  id='href'
                  value={component.href}
                  onChange={(e) => handleUpdate({ href: e.target.value })}
                  placeholder='https://example.com'
                  className='mt-1.5'
                />
              </div>
            )}
          </>
        )}

        {component.type === 'img' && (
          <>
            {'src' in component && (
              <div>
                <Label
                  htmlFor='src'
                  className='text-sm font-medium text-foreground'
                >
                  Image URL
                </Label>
                <Input
                  id='src'
                  value={component.src}
                  onChange={(e) => handleUpdate({ src: e.target.value })}
                  placeholder='https://example.com/image.jpg'
                  className='mt-1.5'
                />
              </div>
            )}
            {'width' in component && (
              <div>
                <Label
                  htmlFor='width'
                  className='text-sm font-medium text-foreground'
                >
                  Width (px)
                </Label>
                <Input
                  id='width'
                  type='number'
                  value={component.width}
                  onChange={(e) =>
                    handleUpdate({ width: Number(e.target.value) })
                  }
                  className='mt-1.5'
                />
              </div>
            )}
            {'height' in component && (
              <div>
                <Label
                  htmlFor='height'
                  className='text-sm font-medium text-foreground'
                >
                  Height (px)
                </Label>
                <Input
                  id='height'
                  type='number'
                  value={component.height}
                  onChange={(e) =>
                    handleUpdate({ height: Number(e.target.value) })
                  }
                  className='mt-1.5'
                />
              </div>
            )}
            {'alt' in component && (
              <div>
                <Label
                  htmlFor='alt'
                  className='text-sm font-medium text-foreground'
                >
                  Alt Text
                </Label>
                <Input
                  id='alt'
                  value={component.alt}
                  onChange={(e) => handleUpdate({ alt: e.target.value })}
                  placeholder='Image description'
                  className='mt-1.5'
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
