import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import httpClient from "@/modules/Common/Services/http.server.service";
import { AuthProvider } from "@/modules/Auth/Providers/AuthProvider";
import TenantProvider from "@/modules/Common/Providers/TenantProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import DesignerContextProvider from "@/modules/Questionnaires/Providers/DesignerContextProvider";
import NextTopLoader from "nextjs-toploader";
export const dynamic = "force-dynamic";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const getInitialData = async () => {
  try {
    const response = await httpClient.get("tenant/bootstrap");

    return response?.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInitialData();

  return {
    title: data.tenant?.name || "Versa boilerplate",
    icons: {
      icon: data.tenant?.theme?.favicon_url || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getInitialData();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Toaster />
        <NextTopLoader
          color={initialData.tenant?.theme?.secondary_color_light || "#000000"}
        />
        <TooltipProvider>
          <TenantProvider initialData={initialData}>
            <AuthProvider>
              <DesignerContextProvider>{children}</DesignerContextProvider>
            </AuthProvider>
          </TenantProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
