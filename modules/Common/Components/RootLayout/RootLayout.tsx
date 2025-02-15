"use client";

import React from "react";
import RootHeader from "./Header/RootHeader";
import ErrorLayout from "./ErrorLayout/ErrorLayout";
import Stop from "./Icons/Stop";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import LoadingComponent from "./_partials/LoadingComponent";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RootSidebar from "./Sidebar/RootSidebar";

interface RootLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  path?: { url: string; name: string }[];
  requiredPermission?: string;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  pageTitle,
  path,
  requiredPermission,
}) => {
  const { userData } = useAuth();

  return (
    <>
      {userData ? (
        <>
          {userData?.permissions.some((permission) =>
            permission.includes(requiredPermission ?? ""),
          ) ? (
            <>
              <SidebarProvider defaultOpen={false}>
                <RootSidebar />
                <SidebarInset>
                  <RootHeader pageTitle={pageTitle} path={path} />
                  <div className="flex flex-1 flex-col gap-4 pt-16 overflow-y-auto">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </>
          ) : (
            <ErrorLayout
              statusCode={403}
              title="Acesso negado"
              description="você não tem permissão para acessar esta página"
              icon={<Stop />}
            />
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default RootLayout;
