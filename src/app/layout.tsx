import { bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/modules/auth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";

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
          </ThemeProvider>
          <Toaster position="bottom-right" duration={6000} />
        </AuthProvider>
      </body>
    </html>
  );
};

export default layout;
