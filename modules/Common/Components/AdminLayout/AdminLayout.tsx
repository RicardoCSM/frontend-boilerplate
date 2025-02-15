"use client";

import React from "react";
import AdminHeader from "./Header/AdminHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./Sidebar/AdminSidebar";
import ErrorLayout from "../RootLayout/ErrorLayout/ErrorLayout";
import Stop from "../RootLayout/Icons/Stop";
import LoadingComponent from "../RootLayout/_partials/LoadingComponent";
import useAuth from "@/modules/Auth/Hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  path?: { url: string; name: string }[];
  requiredPermission?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
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
            <SidebarProvider defaultOpen={false}>
              <AdminSidebar />
              <SidebarInset>
                <AdminHeader pageTitle={pageTitle} path={path} />
                <div className="flex flex-1 flex-col gap-4 pt-16 overflow-y-auto">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
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

export default AdminLayout;
