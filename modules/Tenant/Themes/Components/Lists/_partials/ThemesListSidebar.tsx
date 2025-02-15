"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import Theme from "../../../Interfaces/Theme";
import { Dispatch, SetStateAction } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ThemesListSidebar {
  themes: Theme[];
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme | null) => void;
  setSelectedMode: Dispatch<SetStateAction<"view" | "edit" | "create">>;
}

const ThemesListSidebar: React.FC<ThemesListSidebar> = ({
  themes,
  selectedTheme,
  setSelectedTheme,
  setSelectedMode,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { userData } = useAuth();

  return (
    <>
      {isLargeScreen ? (
        <aside className="-mx-4 w-1/6 pr-2 h-full overflow-y-auto">
          <nav className="flex flex-col space-x-0 space-y-2 ">
            <h4 className="text-sm font-medium text-tenant-primary">Temas</h4>
            {themes &&
              themes.map((item) => (
                <div
                  className="flex justify-between w-full items-center"
                  key={item.id}
                >
                  <Button
                    type="button"
                    variant={
                      selectedTheme?.id === item.id
                        ? "tenantSecondary"
                        : "tenantOutline"
                    }
                    className="w-full flex justify-between"
                    onClick={() => {
                      if (
                        userData?.permissions.includes("ALL-edit-themes")
                      ) {
                        setSelectedMode("edit");
                      } else if (
                        userData?.permissions.includes("ALL-view-themes")
                      ) {
                        setSelectedMode("view");
                      } else {
                        return;
                      }

                      setSelectedTheme(item);
                    }}
                  >
                    <p className="w-full text-left text-ellipsis overflow-hidden">
                      {item.title}
                    </p>
                  </Button>
                </div>
              ))}
            {userData?.permissions.includes("ALL-create-themes") && (
              <div className="flex justify-between w-full items-center">
                <Button
                  className="w-full text-left"
                  variant="tenantPrimary"
                  onClick={() => {
                    setSelectedTheme(null);
                    setSelectedMode("create");
                  }}
                >
                  <PlusCircleIcon className="size-4 mr-2" />
                  <h2>Adicionar tema</h2>
                </Button>
              </div>
            )}
          </nav>
        </aside>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex w-full justify-center pt-4">
              <Button variant="tenantPrimary">Selecionar tema</Button>
            </div>
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Selecionar tema</SheetTitle>
            </SheetHeader>
            <nav className="flex mt-2 flex-col space-y-2">
              {themes &&
                themes.map((item) => (
                  <div
                    className="flex justify-between w-full items-center"
                    key={item.id}
                  >
                    <Button
                      type="button"
                      variant={
                        selectedTheme?.id === item.id
                          ? "tenantSecondary"
                          : "tenantOutline"
                      }
                      className="w-full flex justify-between"
                      onClick={() => {
                        if (
                          userData?.permissions.includes("ALL-edit-themes")
                        ) {
                          setSelectedMode("edit");
                        } else if (
                          userData?.permissions.includes("ALL-view-themes")
                        ) {
                          setSelectedMode("view");
                        } else {
                          return;
                        }

                        setSelectedTheme(item);
                      }}
                    >
                      <p className="w-full text-left text-ellipsis overflow-hidden">
                        {item.title}
                      </p>
                    </Button>
                  </div>
                ))}
              {userData?.permissions.includes("ALL-create-themes") && (
                <div className="flex justify-between w-full items-center">
                  <Button
                    className="w-full text-left"
                    variant="tenantPrimary"
                    onClick={() => {
                      setSelectedTheme(null);
                      setSelectedMode("create");
                    }}
                  >
                    <PlusCircleIcon className="size-4 mr-2" />
                    <h2>Adicionar tema</h2>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ThemesListSidebar;
