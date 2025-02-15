"use client";

import React from "react";
import { icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ValidIcons } from "../../Constants/ValidIcons";
import { useFormContext } from "react-hook-form";
import Icon from "./Icon";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  label: keyof typeof icons;
  value: keyof typeof icons;
}

function generateLucideIconOptions(): Option[] {
  return ValidIcons.map((icon) => ({
    label: icon as keyof typeof icons,
    value: icon as keyof typeof icons,
  }));
}

interface IconsComboboxProps {
  displayLabel?: boolean;
  disabled?: boolean;
}

const IconsCombobox: React.FC<IconsComboboxProps> = ({
  displayLabel = true,
  disabled = false,
}) => {
  const form = useFormContext();
  const icons = generateLucideIconOptions();

  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          {displayLabel && <FormLabel>Ícone</FormLabel>}
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between px-2",
                    form.formState.errors.icon && "border-red-500",
                  )}
                >
                  <div>{field.value && <Icon name={field.value} />}</div>
                  <div>
                    <CaretSortIcon className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Command>
                <CommandInput placeholder="Procurar ícone" />
                <CommandEmpty>Nenhum ícone encontrado</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    <ScrollArea>
                      <div className="grid grid-cols-6 pr-4 max-h-[200px]">
                        {icons.map((icon) => (
                          <CommandItem
                            key={icon.value}
                            value={icon.value}
                            onSelect={(currentValue) => {
                              const newValue =
                                currentValue === field.value ? "" : currentValue;
                              field.onChange(newValue);
                              setOpen(false);
                            }}
                          >
                            <Icon name={icon.value} />
                          </CommandItem>
                        ))}
                      </div>
                    </ScrollArea>
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IconsCombobox;
