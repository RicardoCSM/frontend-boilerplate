"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

interface MobileHeaderThemeToggle {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const MobileHeaderThemeToggle: React.FC<MobileHeaderThemeToggle> = ({
  isOpen,
  setIsOpen,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Alterar tema</DrawerTitle>
        </DrawerHeader>
        <hr />
        <RadioGroup
          defaultValue={theme}
          onValueChange={(value) => setTheme(value)}
          className="flex flex-col w-full items-center px-1 py-4"
        >
          <div className="w-3/4 p-2 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-lg flex items-center" htmlFor="light">
                <Sun className="h-4 w-4 mr-2" />
                Tema Claro
              </Label>
              <RadioGroupItem value="light" id="light" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-lg flex items-center" htmlFor="dark">
                <Moon className="h-4 w-4 mr-2" />
                Tema Escuro
              </Label>
              <RadioGroupItem value="dark" id="dark" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-lg flex items-center" htmlFor="system">
                <SunMoon className="h-4 w-4 mr-2" />
                Padrão do Sistema
              </Label>
              <RadioGroupItem value="system" id="system" />
            </div>
          </div>
        </RadioGroup>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeaderThemeToggle;
