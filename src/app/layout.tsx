import { bodyFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/modules/auth';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { success } from 'zod';

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang='en'>
      <body
        className={cn(
          'antialiased bg-background text-foreground transition-all duration-300',
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
            <Toaster
              position='top-center'
              toastOptions={{
                className: '',
                style: {
                  background: '#FFFFFF',
                  border: '1px solid #CCCCCC',
                  padding: '16px',
                  color: '#000000',
                },
                success: {
                  style: {
                    background: '#ABD9AB',
                    color: '#204620',
                  },
                },
                error: {
                  style: {
                    background: '#F4CDCD',
                    color: '#641616',
                  },
                },
                loading: {
                  style: {
                    background: '#ECEFF1',
                    color: '#000000',
                  },
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default layout;
