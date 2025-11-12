import { bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/modules/auth";
import { ThemeProvider } from "@/providers/ThemeProvider";

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased bg-background text-foreground transition-all duration-300",
          bodyFont.className
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
            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default layout;
