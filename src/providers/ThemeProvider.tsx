"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const changeTheme = () => {
      try {
        setMounted(true);
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Error changing theme"
        );
      }
    };
    changeTheme();
  }, []);

  if (!mounted) {
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
