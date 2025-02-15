"use client";

import { useState } from "react";
import Theme from "../../Interfaces/Theme";
import ThemesListSidebar from "./_partials/ThemesListSidebar";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import ThemeActionsForm from "../Forms/ThemeActionsForm";
import CreateThemeForm from "../Forms/CreateThemeForm";
import { Separator } from "@/components/ui/separator";
import { Palette } from "lucide-react";
import DeleteThemeDialog from "../Dialogs/DeleteThemeDialog";

interface ThemesListProps {
  themes: Theme[];
  refreshThemes: (setFirstItemAsSelected?: boolean) => Promise<void>;
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme | null) => void;
}

const ThemesList: React.FC<ThemesListProps> = ({
  themes,
  refreshThemes,
  selectedTheme,
  setSelectedTheme,
}) => {
  const { userData } = useAuth();
  const [selectedMode, setSelectedMode] = useState<"edit" | "create" | "view">(
    "edit",
  );

  return (
    <div className="flex flex-col flex-1 w-full lg:p-4">
      <div className="flex flex-col lg:flex-row w-full flex-grow relative h-[200px] space-y-4 lg:space-x-12 lg:space-y-0 lg:px-4">
        {userData?.permissions.includes("ALL-list-themes") && (
          <ThemesListSidebar
            themes={themes}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            setSelectedMode={setSelectedMode}
          />
        )}
        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="px-4 flex flex-col h-full space-y-4 w-full">
            <div className="flex flex-col">
              <h3 className="flex justify-between scroll-m-20 items-center gap-1 font-semibold text-xl md:text-3xl tracking-tight">
                <span className="flex items-center">
                  <span>
                    <Palette className="size-6 mr-2" />
                  </span>
                  {selectedTheme?.title || "Criar um novo tema"}
                </span>
                <span className="flex items-center gap-2">
                  {userData?.permissions.includes("ALL-delete-themes") &&
                    selectedTheme &&
                    !selectedTheme.active && (
                      <DeleteThemeDialog
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                        refreshThemes={refreshThemes}
                      />
                    )}
                </span>{" "}
              </h3>
              <p className="text-tenant-primary text-md ">
                {selectedMode === "edit"
                  ? "Editar o tema selecionado"
                  : selectedMode === "create"
                    ? "Criar um novo tema"
                    : "Visualizar o tema selecionado"}
              </p>
            </div>
            <Separator />
            {selectedMode === "edit" || selectedMode === "view" ? (
              <>
                {selectedTheme && (
                  <ThemeActionsForm
                    key={selectedTheme.id}
                    theme={selectedTheme}
                    mode={selectedMode}
                    refreshThemes={refreshThemes}
                    setSelectedTheme={setSelectedTheme}
                  />
                )}
              </>
            ) : (
              <CreateThemeForm
                refreshThemes={refreshThemes}
                setSelectedTheme={setSelectedTheme}
                setSelectedMode={setSelectedMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemesList;
