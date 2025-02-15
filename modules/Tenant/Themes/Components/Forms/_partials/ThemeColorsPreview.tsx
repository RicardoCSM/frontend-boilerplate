"use client";

import { cn } from "@/lib/utils";

interface ThemeColorsPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  dark?: boolean;
}

const ThemeColorsPreview: React.FC<ThemeColorsPreviewProps> = ({
  primaryColor,
  secondaryColor,
  dark = false,
}) => {
  return (
    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
      <div
        className={cn(
          dark ? "dark" : "",
          "space-y-2 rounded-sm bg-background p-2",
        )}
      >
        <div className="space-y-2 rounded-md bg-card p-2 shadow-sm">
          <div
            className="h-2 w-[80px] rounded-lg"
            style={{ backgroundColor: primaryColor }}
          />
          <div
            className="h-2 w-[100px] rounded-lg"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
        <div className="flex items-center space-x-2 rounded-md bg-card p-2 shadow-sm">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          <div
            className="h-2 w-[100px] rounded-lg"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        <div className="flex items-center space-x-2 rounded-md bg-card p-2 shadow-sm">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          <div
            className="h-2 w-[100px] rounded-lg"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeColorsPreview;
