/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOptions = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOptions[];
  selected: string;
  error?: any;
  className?: string;
  placeholder?: string;
  modal?: boolean;
  onChange?: (event: string) => void;
  onCreate?: (value: string) => void;
  disabled?: boolean;
}

export function Combobox({
  options,
  selected,
  className,
  placeholder,
  modal = false,
  error,
  onChange,
  onCreate,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen} modal={modal}>
        <PopoverTrigger asChild>
          <Button
            key={"combobox-trigger"}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-max justify-between whitespace-normal",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            disabled={disabled}
          >
            {selected && selected.length > 0 ? (
              <>
                <div className="relative mr-auto flex flex-grow items-center overflow-hidden">
                  <span>
                    {options.find((item) => item.value === selected)?.label}
                  </span>
                </div>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[200px] lg:w-[400px] max-w-sm p-0"
        >
          <Command>
            <CommandInput
              placeholder={placeholder ?? "Procurar..."}
              value={query}
              onValueChange={(value: string) => setQuery(value)}
            />
            <CommandList>
              <CommandEmpty
                onClick={() => {
                  if (onCreate) {
                    onCreate(query);
                    setQuery("");
                  }
                }}
                className="flex cursor-pointer items-center justify-center gap-1"
              >
                {onCreate ? (
                  <>
                    <p>Criar: </p>
                    <p className="block max-w-48 truncate font-semibold text-primary">
                      {query}
                    </p>
                  </>
                ) : (
                  <>Nenhum item encontrado.</>
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (onChange) {
                        onChange(option.value);
                      }
                    }}
                  >
                    <div className="flex w-4 h-full mr-2 ">
                      <div>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selected === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </div>
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
