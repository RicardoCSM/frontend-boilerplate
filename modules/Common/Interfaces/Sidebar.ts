import { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  requiredPermission?: string;
}

export interface SidebarNavGroup {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: SidebarNavItem[];
}

export interface SidebarNav {
  navMain: SidebarNavGroup[];
  navIndex: SidebarNavItem[];
}
