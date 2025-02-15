"use client";

import React from "react";
import ThemeToggle from "../../RootLayout/_partials/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminHeaderMenu from "./AdminHeaderMenu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AdminMobileHeaderMenu from "./AdminMobileHeaderMenu";
import Logo from "../../RootLayout/_partials/Logo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  pageTitle: string;
  path?: { url: string; name: string }[];
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle, path }) => {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-20 border-b bg-background/95 backdrop-blur transition-[left] ease-linear",
        state === "collapsed" && !isMobile
          ? `left-[--sidebar-width-icon]`
          : `left-[--sidebar-width]`,
        isMobile && "left-0",
      )}
    >
      <nav className="flex h-16 shrink-0 items-center gap-2 transition-[width] ease-linear px-4 justify-between">
        {!isMobile ? (
          <div className="flex gap-2 items-center">
            <SidebarTrigger className="text-tenant-primary" />
            <Separator orientation="vertical" className="h-4" />
            {path && path.length > 0 && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={path[path.length - 1].url}>
                        <Undo2 />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voltar para a página anterior</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}
            <div className="flex flex-col gap-1 pl-2">
              <Breadcrumb>
                <BreadcrumbList className="text-md">
                  {path &&
                    path.map((item) => (
                      <React.Fragment key={item.url}>
                        <BreadcrumbItem>
                          <BreadcrumbLink href={item.url}>
                            {item.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </React.Fragment>
                    ))}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Logo reduced />
            <Separator orientation="vertical" className="h-4" />
            <SidebarTrigger className="text-tenant-primary" />
          </div>
        )}
        <div className="flex items-start gap-5 sm:gap-3">
          {!isMobile ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/home">Home</Link>
              </Button>
              <ThemeToggle />
              <AdminHeaderMenu />
            </>
          ) : (
            <AdminMobileHeaderMenu />
          )}
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
