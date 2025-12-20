'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { EmailComponent } from '@/lib/mailer-react-code/email-types';
import { CodeExport } from './reactCodeEditor/CodeExports';
import { ComponentLibrary } from './reactCodeEditor/ComponentsLibrary';
import { ComponentTree } from './reactCodeEditor/ComponentsTree';
import { PropertyEditor } from './reactCodeEditor/PropertyEditor';

export  function ReactCodeEditor() {
  const [components, setComponents] = useState<EmailComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState('Email preview text...');

  return (
    <div className='h-screen flex flex-col gap-4 p-1'>
      {/* Header */}
      <header className='border-b border-border bg-card px-6 py-4 rounded-lg'>
        <div className='flex items-center justify-between'>
          <div className='min-w-64'>
            <h1 className='text-2xl font-bold text-foreground'>
              React Mail Editor
            </h1>
            <p className='text-sm text-muted-foreground'>
              Build email templates visually
            </p>
          </div>
          {/* <CodeExport components={components} previewText={previewText} /> */}
      <Alert >
        <Info />
        <AlertTitle className='flex'>
          This editor uses <strong>@react-email/components</strong>.{' '}
        </AlertTitle>
        <AlertDescription className='flex'>
          {' '}
          You can customize components with Tailwind classes, but note tha block
          properties like padding, flex, grid may not work un
          all email clients
        </AlertDescription>
      </Alert>
        </div>
      </header>


      {/* Main Content */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left Panel - Component Library */}
        <aside className='w-64 border-r border-border bg-card overflow-y-auto'>
          <ComponentLibrary
            components={components}
            onAddComponent={setComponents}
            selectedId={selectedId}
          />
        </aside>

        {/* Center Panel - Component Tree */}
        <main className='flex-1 overflow-y-auto bg-muted/30 p-6'>
          <ComponentTree
            components={components}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdate={setComponents}
            previewText={previewText}
            onPreviewChange={setPreviewText}
          />
        </main>

        {/* Right Panel - Property Editor */}
        <aside className='w-80 border-l border-border bg-card overflow-y-auto'>
          <PropertyEditor
            components={components}
            selectedId={selectedId}
            onUpdate={setComponents}
          />
        </aside>
      </div>
    </div>
  );
}
