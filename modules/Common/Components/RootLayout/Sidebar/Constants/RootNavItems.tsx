import { SidebarNav } from "@/modules/Common/Interfaces/Sidebar";
import { Home, Shapes } from "lucide-react";

export const RootNavItems: SidebarNav = {
  navIndex: [
    {
      title: "Dashboard",
      url: "/home",
      icon: Home,
    },
    {
      title: "Ações Coletivas",
      url: "/collective-actions",
      icon: Shapes,
      requiredPermission: "collective-actions",
    },
  ],
  navMain: [],
};
