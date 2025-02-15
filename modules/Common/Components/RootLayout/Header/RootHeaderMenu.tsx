"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RootHeaderMenuUser from "./RootHeaderMenuUser";
import { LogOut } from "lucide-react";
import useAuth from "@/modules/Auth/Hooks/useAuth";

const RootHeaderMenu = () => {
  const { userData, logout } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-6 items-center">
        {userData && (
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent"
                >
                  <Avatar>
                    <AvatarImage src={userData.avatar ?? ""} />
                    <AvatarFallback>{userData.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <RootHeaderMenuUser user={userData} />
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default RootHeaderMenu;
