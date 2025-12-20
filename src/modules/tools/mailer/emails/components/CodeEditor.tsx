'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export type EditorMode = 'text' | 'html' | 'react';

export  function EmailTemplateEditor() {
  const [mode, setMode] = useState<EditorMode>('text');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [textContent, setTextContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
    const [reactContent, setReactContent] = useState('');
    

    
  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Emails Templates Editor</h1>
        <p className='text-muted-foreground'>
          Create plain text, HTML or React Component Emails Template
        </p>
      </div>

      <Card className='p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <label className='text-sm font-medium'>Mode:</label>
          <Select
            value={mode}
            onValueChange={(value) => setMode(value as EditorMode)}
          >
            <SelectTrigger className='w-50'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='text'>Text</SelectItem>
              <SelectItem value='html'>HTML</SelectItem>
              <SelectItem value='react'>React</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as never)}>
          <TabsList>
            <TabsTrigger value='editor'>
              <Code className='mr-2 h-4 w-4' />
              Editor
            </TabsTrigger>
            <TabsTrigger value='preview'>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value='editor' className='mt-4'>
            {mode === 'text' && (
              <div className='space-y-2'>
                <Label htmlFor='text-editor'>Plain Text</Label>
                <Textarea
                  id='text-editor'
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder='Write your text here...'
                  className='min-h-125'
                />
              </div>
            )}

            {mode === 'html' && (
              <div className='space-y-2'>
                <Label htmlFor='html-editor'>
                  HTML + CSS (use CSS Embedding a {'<style>'} tag)
                </Label>
                <Textarea
                  id='html-editor'
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder={`<!DOCTYPE html>
<html>
<head>
  <style>
    /* Tu CSS aquí */
    body { font-family: Arial; }
  </style>
</head>
<body>
  <!-- Tu HTML aquí -->
</body>
</html>`}
                  className='font-mono text-sm min-h-125'
                />
              </div>
            )}

            {mode === 'react' && (
              <div className='space-y-2'>
                <Label htmlFor='react-editor'>React Component</Label>
                <Textarea
                  id='react-editor'
                  value={reactContent}
                  onChange={(e) => setReactContent(e.target.value)}
                  placeholder={`export default function EmailTemplate() {
  return (
    <div>
      <h1>Hola Mundo</h1>
      <p>Tu contenido aquí</p>
    </div>
  )
}`}
                  className='font-mono text-sm min-h-125'
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value='preview' className='mt-4'>
            <Card className='p-6 min-h-100 bg-muted'>
              {mode === 'text' && (
                <pre className='whitespace-pre-wrap font-sans'>
                  {textContent}
                </pre>
              )}

              {mode === 'html' && (
                <iframe
                  srcDoc={htmlContent}
                  className='w-full h-150 border-0 rounded-md'
                  title='HTML Preview'
                  sandbox='allow-scripts'
                              />
                             
              )}

              {mode === 'react' && (
                <div className='p-4 border-2 border-dashed border-yellow-500 rounded-md'>
                  <p className='text-sm text-muted-foreground mb-2'>
                                   
                                      React Preview (simulated reder)
                  </p>
                  <div className='bg-muted p-4 rounded-md'>
                    <pre className='text-xs overflow-auto'>{reactContent}</pre>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
