'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Code, Copy, Check } from 'lucide-react';
import { EmailComponent } from '@/lib/mailer-react-code/email-types';
import { generateEmailCode } from '@/lib/mailer-react-code/code-generator';


interface CodeExportProps {
  components: EmailComponent[];
  previewText: string;
}

export function CodeExport({ components, previewText }: CodeExportProps) {
  const [copied, setCopied] = useState(false);
  const code = generateEmailCode(components, previewText);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' className='gap-2'>
          <Code className='h-4 w-4' />
          Export Code
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[80vh]'>
        <DialogHeader>
          <DialogTitle>Export React Email Code</DialogTitle>
          <DialogDescription>
            Copy this code to use in your React Email project. Import it in your
            emails directory.
          </DialogDescription>
        </DialogHeader>
        <div className='relative'>
          <Button
            variant='outline'
            size='sm'
            className='absolute top-3 right-3 z-10 gap-2 bg-transparent'
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className='h-4 w-4' />
                Copied!
              </>
            ) : (
              <>
                <Copy className='h-4 w-4' />
                Copy
              </>
            )}
          </Button>
          <pre className='bg-muted p-6 rounded-lg overflow-auto max-h-[60vh] text-sm'>
            <code className='font-mono text-foreground'>{code}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
