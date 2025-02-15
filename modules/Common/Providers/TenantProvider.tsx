"use client";

import React, { createContext, ReactNode, useEffect } from "react";
import { TenantData } from "../Interfaces/Tenant";
import { ThemeProvider } from "next-themes";
import { hexToHsl } from "@/lib/utils";

export const TenantContext = createContext({} as TenantData);

interface TenantProviderProps {
  children: ReactNode;
  initialData: TenantData;
}
export default function TenantProvider({
  children,
  initialData,
}: TenantProviderProps) {
  const {
    tenant: { theme: theme },
  } = initialData;

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--primary-color-light",
      hexToHsl(theme.primary_color_light),
    );
    root.style.setProperty(
      "--secondary-color-light",
      hexToHsl(theme.secondary_color_light),
    );
    root.style.setProperty(
      "--primary-color-dark",
      hexToHsl(theme.primary_color_dark),
    );
    root.style.setProperty(
      "--secondary-color-dark",
      hexToHsl(theme.secondary_color_dark),
    );
  }, [theme]);

  return (
    <TenantContext.Provider value={initialData}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TenantContext.Provider>
  );
}
