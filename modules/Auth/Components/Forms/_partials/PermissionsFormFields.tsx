"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionModule } from "@/modules/Auth/Interfaces/Role";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface PermissionsFormFieldsProps {
  disabled: boolean;
  permissionModules: PermissionModule[];
}

interface PermissionsFormValues {
  permissions: string[];
}

const PermissionsFormFields: React.FC<PermissionsFormFieldsProps> = ({
  permissionModules,
  disabled,
}) => {
  const form = useFormContext<PermissionsFormValues>();
  const [selectedModule, setSelectedModule] = useState<PermissionModule>(
    permissionModules[0],
  );
  const [filteredGroups, setFilteredGroups] = useState(selectedModule.groups);

  useEffect(() => {
    setFilteredGroups(selectedModule.groups);
  }, [selectedModule]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();

    const filteredItems = selectedModule.groups.filter((group) =>
      group.permissions.some((permission) =>
        permission.description.toLowerCase().includes(term),
      ),
    );

    setFilteredGroups(filteredItems);
  };

  return (
    <FormField
      control={form.control}
      name="permissions"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Permissões</FormLabel>
          <div className="border shadow-sm rounded-md">
            <div className="flex flex-col md:flex-row">
              <div className="border-b md:border-b-0 md:border-r p-2 flex flex-col gap-2 md:gap-6">
                {permissionModules.map((module) => (
                  <div key={module.name}>
                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      onClick={() => setSelectedModule(module)}
                      disabled={disabled}
                    >
                      {module.name}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex-1 ">
                <div className="relative m-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="w-4 h-4 text-input" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar permissão"
                    className="pl-10 rounded-s-full rounded-e-full"
                    onChange={handleSearch}
                    disabled={disabled}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 space-y-2">
                  {filteredGroups.map((group) => (
                    <div key={group.name}>
                      <div className="flex items-center gap-2 pb-2">
                        <Checkbox
                          id={group.name}
                          className="border-tenant-primary data-[state=checked]:bg-tenant-primary"
                          checked={field.value?.some((value) =>
                            group.permissions
                              .map((permission) => permission.name)
                              .includes(value),
                          )}
                          disabled={disabled}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([
                                  ...field.value,
                                  ...group.permissions.map(
                                    (permission) => permission.name,
                                  ),
                                ])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) =>
                                      !group.permissions
                                        .map((permission) => permission.name)
                                        .includes(value),
                                  ),
                                );
                          }}
                        />
                        <Label>{group.name}</Label>
                      </div>
                      <div className="flex flex-col gap-1 pl-5">
                        {group.permissions.map((permission) => (
                          <div
                            key={permission.name}
                            className="flex w-full justify-start gap-3 items-center"
                          >
                            <FormControl>
                              <Checkbox
                                id={permission.name}
                                className="border-tenant-primary data-[state=checked]:bg-tenant-primary"
                                checked={field.value?.includes(permission.name)}
                                disabled={disabled}
                                value={permission.name}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        permission.name,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== permission.name,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <Label
                              htmlFor={permission.name}
                              className="font-normal text-primary/80"
                            >
                              {permission.description}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PermissionsFormFields;
