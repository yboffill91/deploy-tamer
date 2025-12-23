import { bodyFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '@/modules/auth/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TAMERStudio',
  description: 'A Tamer Digital Tool',
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
        url: '/favicons/favicon-light.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
        url: '/favicons/favicon-dark.ico',
      },
    ],
  },
};

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang='en'>
      <body
        className={cn(
          'antialiased bg-background text-foreground transition-all duration-100 ',
          bodyFont.className
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
          <Toaster position='bottom-right' duration={1500} expand />
        </AuthProvider>
      </body>
    </html>
  );
};

export default layout;
