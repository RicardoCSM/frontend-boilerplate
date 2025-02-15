"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function RootNavFiltered({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const { state } = useSidebar();

  return (
    <>
      {items.length > 0 ? (
        <SidebarGroup>
          {state != "collapsed" && (
            <SidebarGroupLabel>Resultados:</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive asChild tooltip={item.title}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ) : (
        <SidebarGroup>
          <SidebarGroupLabel>Nenhum resultado encontrado</SidebarGroupLabel>
        </SidebarGroup>
      )}
    </>
  );
}
