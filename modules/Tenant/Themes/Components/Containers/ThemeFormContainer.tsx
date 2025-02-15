"use client";

import { useCallback, useEffect, useState } from "react";
import Theme from "../../Interfaces/Theme";
import { LoaderCircle } from "lucide-react";
import ThemesList from "../Lists/ThemesList";
import themesService from "../../Services/themes.service";

const ThemeFormContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const fetchThemes = useCallback(
    async (setFirstItemAsSelected?: boolean) => {
      try {
        const response = await themesService.index({
          per_page: "all",
        });

        if (response.status === 200) {
          setThemes(response.data);
          if (
            (!selectedTheme || setFirstItemAsSelected) &&
            response.data.length > 0
          ) {
            setSelectedTheme(response.data[0]);
          }
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTheme],
  );

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          <ThemesList
            themes={themes}
            refreshThemes={fetchThemes}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />
        </>
      )}
    </>
  );
};

export default ThemeFormContainer;
