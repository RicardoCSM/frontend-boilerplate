import { SidebarNav } from "@/modules/Common/Interfaces/Sidebar";
import {
  Files,
  LayoutDashboard,
  LockOpen,
  Scroll,
  Settings,
} from "lucide-react";

export const AdminNavItems: SidebarNav = {
  navIndex: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      requiredPermission: "admin-panel",
    },
    {
      title: "Questionários",
      url: "/admin/questionnaires",
      icon: Files,
      requiredPermission: "questionnaires",
    },
  ],
  navMain: [
    {
      title: "Acesso",
      url: "#",
      icon: LockOpen,
      items: [
        {
          title: "Usuários",
          url: "/admin/access/users",
          requiredPermission: "users",
        },
        {
          title: "Grupos",
          url: "/admin/access/roles",
          requiredPermission: "roles",
        },
      ],
    },
    {
      title: "Logs",
      url: "#",
      icon: Scroll,
      items: [
        {
          title: "Acesso",
          url: "/admin/logs/access",
          requiredPermission: "access-logs",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Versa 360",
          url: "/admin/configs/versa360",
          requiredPermission: "get-versa360-client",
        },
        {
          title: "Temas",
          url: "/admin/configs/themes",
          requiredPermission: "themes",
        },
        {
          title: "Banners de Login",
          url: "/admin/configs/ads",
          requiredPermission: "ads",
        },
      ],
    },
  ],
};
