"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import versa360Service from "@/modules/Auth/Services/versa360.service";
import { ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const RootVersa360 = () => {
  const { resolvedTheme } = useTheme();

  const versa360Redirect = async () => {
    const newWindow = window.open("about:blank", "_blank");

    try {
      const response = await versa360Service.redirect();
      if (response.status === 200 && newWindow) {
        newWindow.location.href = response.data.url;
      }
    } catch (e: unknown) {
      console.error("Error while redirecting to Versa 360:", e);
      if (newWindow) {
        newWindow.close();
      }
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex w-full justify-center">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={versa360Redirect}
        >
          {resolvedTheme === "dark" ? (
            <Image
              src="/images/contrast-reduced-versa360.svg"
              alt="Versa 360"
              width={32}
              height={32}
            />
          ) : (
            <Image
              src="/images/reduced-versa360.svg"
              alt="Versa 360"
              width={32}
              height={32}
            />
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Versa 360</span>
            <span className="truncate text-xs">Analise os seus dashboards</span>
          </div>
          <ExternalLink className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default RootVersa360;
