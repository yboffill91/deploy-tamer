import { bodyFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/modules/auth';
import { ThemeProvider } from '@/providers/ThemeProvider';

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased bg-background text-foreground transition-all duration-300',
          bodyFont.className,
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
};

export default layout;
