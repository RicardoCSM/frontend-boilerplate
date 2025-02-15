"use client";

import { useState, useEffect, useRef } from "react";
import { MenuIcon, Moon, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AdminHeaderMenuUser from "./AdminHeaderMenuUser";
import MobileHeaderThemeToggle from "../../RootLayout/_partials/MobileHeaderThemeToggle";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import Link from "next/link";

const AdminMobileHeaderMenu = () => {
  const [open, setOpen] = useState(false);
  const isMounted = useRef(false);
  const [isThemeToggleOpen, setIsThemeToggleOpen] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    if (isMounted.current) {
      setOpen((previous) => !previous);
    }
    isMounted.current = true;
  }, [isThemeToggleOpen]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="flex items-center justify-center gap-2 cursor-pointer rounded-full text-tenant-primary">
            <MenuIcon />
          </div>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="w-full rounded-b-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col px-1 py-6 gap-4">
            <Button asChild variant="outline">
              <Link href="/home">Home</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsThemeToggleOpen(true)}
            >
              <Sun
                className="h-4 w-4 mr-2 block dark:hidden"
                aria-hidden="true"
              />
              <Moon
                className="h-4 w-4 mr-2 hidden dark:block"
                aria-hidden="true"
              />
              Alterar tema
            </Button>
            {userData && (
              <div className="border rounded-md p-2">
                <AdminHeaderMenuUser user={userData} />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <MobileHeaderThemeToggle
        isOpen={isThemeToggleOpen}
        setIsOpen={setIsThemeToggleOpen}
      />
    </>
  );
};

export default AdminMobileHeaderMenu;
