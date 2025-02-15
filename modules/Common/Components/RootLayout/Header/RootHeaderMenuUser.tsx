"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import User from "@/modules/Auth/Interfaces/User";
import CurrentUserEditDialog from "@/modules/Auth/Components/Dialogs/CurrentUserEditDialog";
import useAuth from "@/modules/Auth/Hooks/useAuth";

interface RootHeaderMenuUserProps {
  user: User;
}

const RootHeaderMenuUser: React.FC<RootHeaderMenuUserProps> = ({
  user,
}) => {
  const [isCurrentUserEditDialogOpen, setIsCurrentUserEditDialogOpen] =
    useState<boolean>(false);
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  return (
    <>
      {user && (
        <>
          <div className="flex items-center justify-start gap-4 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.name}</p>
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between gap-2">
            <Button
              variant={isMobile ? "ghost" : "ghost"}
              className="w-full"
              onClick={() => setIsCurrentUserEditDialogOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
              Editar
            </Button>
            {isMobile && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Sair
              </Button>
            )}
          </div>
        </>
      )}
      <CurrentUserEditDialog
        isOpen={isCurrentUserEditDialogOpen}
        setIsOpen={setIsCurrentUserEditDialogOpen}
        user={user}
      />
    </>
  );
};

export default RootHeaderMenuUser;
