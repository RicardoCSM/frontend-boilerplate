"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "../_partials/Logo";
import ThemeToggle from "../_partials/ThemeToggle";
import RootHeaderMenu from "./RootHeaderMenu";
import RootMobileHeaderMenu from "./RootMobileHeaderMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Undo2 } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface RootHeaderProps {
  pageTitle?: string;
  path?: { url: string; name: string }[];
}

const RootHeader: React.FC<RootHeaderProps> = ({ pageTitle, path }) => {
  const { userData } = useAuth();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

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
            {isLargeScreen && (
              <>
                {pageTitle && (
                  <Separator orientation="vertical" className="h-4" />
                )}
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
                      <TooltipContent>
                        Voltar para a página anterior
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                <div className="flex flex-col gap-1">
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
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Logo reduced />
            <Separator orientation="vertical" className="h-4" />
            <SidebarTrigger className="text-tenant-primary" />
          </div>
        )}
        <div className="flex items-center gap-5 md:gap-3">
          {!isMobile ? (
            <>
              {userData &&
                userData.permissions.includes("ALL-access-admin-panel") && (
                  <Button variant="outline" asChild>
                    <Link href="/admin">Administração</Link>
                  </Button>
                )}
              <ThemeToggle />
              <RootHeaderMenu />
            </>
          ) : (
            <RootMobileHeaderMenu />
          )}
        </div>
      </nav>
    </header>
  );
};

export default RootHeader;
