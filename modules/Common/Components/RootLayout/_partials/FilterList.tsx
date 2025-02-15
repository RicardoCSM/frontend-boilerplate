"use client";

import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { AdvancedFilter, Filter } from "../../../Interfaces/Filter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, ListFilter, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DatePicker from "@/components/ui/date-picker";

interface FilterListProps<TData> {
  filterTypes: AdvancedFilter<TData>[];
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  isLoading: boolean;
}

export function FilterList<TData>({
  filterTypes,
  filters,
  setFilters,
  isLoading,
}: FilterListProps<TData>) {
  const [copyFilters, setCopyFilters] = useState<Filter[]>(filters);
  const isFirstRender = useRef(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen && !isFirstRender.current) {
      setFilters(() => [...copyFilters]);
    }
    isFirstRender.current = false;
  }, [isOpen, setFilters, copyFilters]);

  const handleAddFilter = () => {
    setCopyFilters((prevFilters) => {
      return [...prevFilters, { key: "", value: "" }];
    });
  };

  const renderFieldInput = (filter: Filter, index: number) => {
    const filterField = filterTypes.find((f) => f.id === filter.key);
    if (!filterField) return null;

    switch (filterField.type) {
      case "text":
        return (
          <Input
            value={filter.value}
            placeholder={filterField.placeholder}
            onChange={(value) => {
              setCopyFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                newFilters[index].value = value.target.value;
                return newFilters;
              });
            }}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={filter.value}
            placeholder={filterField.placeholder}
            onChange={(value) => {
              setCopyFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                newFilters[index].value = value.target.value;
                return newFilters;
              });
            }}
          />
        );
      case "boolean":
        return (
          <div className="flex w-full justify-center">
            <Switch
              checked={filter.value === "true"}
              onCheckedChange={(value) => {
                setCopyFilters((prevFilters) => {
                  const newFilters = [...prevFilters];
                  newFilters[index].value = value ? "true" : "false";
                  return newFilters;
                });
              }}
            />
          </div>
        );
      case "date":
        return (
          <DatePicker
            date={filter.value ? new Date(filter.value) : undefined}
            setDate={(date: SetStateAction<Date | undefined>) => {
              setCopyFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                if (date instanceof Date) {
                  newFilters[index].value = date.toISOString();
                } else {
                  newFilters[index].value = "";
                }
                return newFilters;
              });
            }}
          />
        );
      case "select":
        return (
          <Select
            defaultValue={filter.value}
            onValueChange={(value) => {
              setCopyFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                newFilters[index].value = value;
                return newFilters;
              });
            }}
          >
            <SelectTrigger className="w-full h-8 border-tenant-primary">
              <SelectValue placeholder="Selecione um valor" />
            </SelectTrigger>
            <SelectContent>
              {filterField.options &&
                filterField.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-input"
          disabled={isLoading}
        >
          <ListFilter className="size-3" aria-hidden="true" />
          Filtros
          {copyFilters.length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal"
            >
              {copyFilters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={16}
        className={cn(
          "flex w-[calc(100vw-theme(spacing.12))] min-w-60 origin-[var(--radix-popover-content-transform-origin)] flex-col p-4 sm:w-[36rem]",
          copyFilters.length > 0 ? "gap-3.5" : "gap-2",
        )}
      >
        {copyFilters.length > 0 ? (
          <h4 className="font-medium leading-none">Filtros</h4>
        ) : (
          <div className="flex flex-col gap-1">
            <h4 className="font-medium leading-none">Nenhum filtro aplicado</h4>
            <p className="text-sm text-muted-foreground">
              Adicione filtros para refinar a busca.
            </p>
          </div>
        )}
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto py-0.5 px-1">
          {copyFilters.map((filter, index) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="tenantOutline"
                      size="sm"
                      role="combobox"
                      className="h-8 w-32 justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0"
                    >
                      <span className="truncate">
                        {filterTypes.find((field) => field.id === filter.key)
                          ?.label ?? "Selecione um campo"}
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-40 p-0">
                    <Command>
                      <CommandInput placeholder="Procurar campos..." />
                      <CommandList>
                        <CommandEmpty>Nenhum campo encontrado</CommandEmpty>
                        <CommandGroup>
                          {filterTypes.map((field) => (
                            <CommandItem
                              key={field.id}
                              value={field.id}
                              onSelect={(value) => {
                                const filterField = filterTypes.find(
                                  (col) => col.id === value,
                                );

                                if (!filterField) return;

                                setCopyFilters((prevFilters) => {
                                  const newFilters = [...prevFilters];
                                  newFilters[index].key = filterField.id;
                                  newFilters[index].value = "";
                                  return newFilters;
                                });
                              }}
                            >
                              <span className="mr-1.5 truncate">
                                {field.label}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto size-4 shrink-0",
                                  field.id === filter.key
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="min-w-36 flex-1">
                  {renderFieldInput(filter, index)}
                </div>
                <Button
                  variant="tenantOutline"
                  size="icon"
                  className="size-8 shrink-0 rounded"
                  onClick={() => {
                    setCopyFilters((prevFilters) => {
                      const newFilters = [...prevFilters];
                      newFilters.splice(index, 1);
                      return newFilters;
                    });
                  }}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="flex w-full items-center gap-2">
          <Button
            variant="tenantPrimary"
            size="sm"
            className="h-[1.85rem] rounded"
            onClick={handleAddFilter}
          >
            Adicionar Filtro
          </Button>
          {filters.length > 0 ? (
            <Button
              variant="tenantOutline"
              className="rounded"
              size="sm"
              onClick={() => setCopyFilters([])}
            >
              Resetar filtros
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
