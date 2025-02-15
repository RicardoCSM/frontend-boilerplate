"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { RootNavIndex } from "./RootNavIndex";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../_partials/Logo";
import { RootNavFiltered } from "./RootNavFiltered";
import RootVersa360 from "./RootVersa360";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import sidebarService from "@/modules/Common/Services/sidebar.service";
import { RootNavItems } from "./Constants/RootNavItems";
import { SidebarNavItem } from "@/modules/Common/Interfaces/Sidebar";

const RootSidebar = () => {
  const { state, isMobile } = useSidebar();
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const authorizedNavItems = sidebarService.getAuthorizedNavItems(
    RootNavItems,
    userData?.permissions || [],
  );
  const [filteredNavItems, setFilteredNavItems] = useState<SidebarNavItem[]>(
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredItems = sidebarService
      .getFlattenedItems(RootNavItems, userData?.permissions || [])
      .filter((item) => item.title.toLowerCase().includes(term));

    setFilteredNavItems(filteredItems);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="min-h-16 p-1">
            <a href="#" className="transition-[width] ease-linear">
              {state === "collapsed" && !isMobile ? (
                <div className="flex h-16 items-center justify-center">
                  <Logo reduced />
                </div>
              ) : (
                <SidebarMenuButton className="w-full h-full justify-center">
                  <Logo className="max-w-[calc(var(--sidebar-width)-8px)]" />
                </SidebarMenuButton>
              )}
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {state === "expanded" && (
          <div className="relative m-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-4 h-4 text-tenant-primary" />
            </div>
            <input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearch}
              className="flex h-9 w-full text-tenant-primary rounded-full border border-tenant-primary bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-tenant-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tenant-primary pl-10"
            />
          </div>
        )}
        {searchTerm != "" ? (
          <RootNavFiltered items={filteredNavItems} />
        ) : (
          <RootNavIndex items={authorizedNavItems.navIndex} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <RootVersa360 />
      </SidebarFooter>
    </Sidebar>
  );
};

export default RootSidebar;
