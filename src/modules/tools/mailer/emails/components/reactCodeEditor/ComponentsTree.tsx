'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentNode } from './ComponentNode';
import { EmailComponent } from '@/lib/mailer-react-code/email-types';

interface ComponentTreeProps {
  components: EmailComponent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (components: EmailComponent[]) => void;
  previewText: string;
  onPreviewChange: (text: string) => void;
}

export function ComponentTree({
  components,
  selectedId,
  onSelect,
  onUpdate,
  previewText,
  onPreviewChange,
}: ComponentTreeProps) {
  if (components.length === 0) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Card className='p-8 max-w-md text-center bg-card border-border'>
          <div className='mb-4'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
              <span className='text-3xl'>📧</span>
            </div>
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            Start Building Your Email
          </h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Add components from the left panel to start creating your email
            template. Begin with a Container to hold your content.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Preview Text Editor */}
      <Card className='p-4 bg-card border-border'>
        <Label
          htmlFor='preview-text'
          className='text-sm font-medium text-foreground mb-2 block'
        >
          Preview Text
        </Label>
        <Input
          id='preview-text'
          value={previewText}
          onChange={(e) => onPreviewChange(e.target.value)}
          placeholder='Email preview text shown in inbox...'
          className='bg-background border-input text-foreground'
        />
        <p className='text-xs text-muted-foreground mt-2'>
          This text appears in email clients before opening the email
        </p>
      </Card>

      {/* Component Tree */}
      <Card className='p-6 bg-card border-border'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-foreground'>
            Email Body Structure
          </h2>
          <p className='text-sm text-muted-foreground'>
            Click to select, drag to reorder
          </p>
        </div>
        <div className='space-y-2'>
          {components.map((component) => (
            <ComponentNode
              key={component.id}
              component={component}
              selectedId={selectedId}
              onSelect={onSelect}
              onUpdate={onUpdate}
              components={components}
              level={0}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
