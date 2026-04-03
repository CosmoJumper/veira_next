"use client";

import { LanguageProvider } from "./language-provider";
import { CityProvider } from "./city-provider";
import { AuthProvider } from "./auth-provider";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CityProvider>{children}</CityProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
