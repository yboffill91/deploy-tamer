import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { getPreference } from "@/server/server-actions";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from "@/types/preferences/theme";
import AuthBridge from "@/components/auth-bridge";
import "./globals.css";
import FCMListener from "@/components/fcm-listener";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import TokenExpiryHandler from "@/components/auth-error-handler";
import AuthProvider from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");
  /* useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("SW registrado:", registration);
      })
      .catch((err) => console.error("Error registrando SW:", err));
  }
}, []); */

  return (
    <ClerkProvider signInUrl="/auth/v2/login" signUpUrl="/auth/v2/register" afterSignOutUrl="/auth/v2/login">
      <FCMListener />
      <html
        lang="en"
        className={themeMode === "dark" ? "dark" : ""}
        data-theme-preset={themePreset}
        suppressHydrationWarning
      >
        <body className={`${inter.className} min-h-screen antialiased`}>
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
          <AuthBridge />
          <TokenExpiryHandler />
          <ReactQueryProvider>
            <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </PreferencesStoreProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
