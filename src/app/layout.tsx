import { bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/modules/auth";

const layout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased bg-background text-foreground",
          bodyFont.className
        )}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
};

export default layout;
