"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Permission, PermissionModule } from "@/modules/Auth/Interfaces/Role";
import permissionsService from "@/modules/Auth/Services/permissions.service";
import rolesService from "@/modules/Auth/Services/roles.service";
import supportService from "@/modules/Common/Services/support.service";
import { LoaderCircle } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

interface UserPermissionsDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userPermissions?: string[];
  userRoles?: string[];
  roles: string[];
}

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  isOpen,
  setIsOpen,
  userPermissions,
  userRoles,
  roles,
}) => {
  const form = useFormContext<{
    extra_permissions: string[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rolesPermissions, setRolesPermission] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionModules, setPermissionModules] = useState<
    PermissionModule[]
  >([]);

  useEffect(() => {
    fetchPermissionModules();
  }, []);

  const fetchRolesPermissions = useCallback(
    async (roles: string[]) => {
      setIsLoading(true);
      try {
        const allPermissions: Permission[] = [];
        for (const role of roles) {
          const response = await rolesService.permissions(role);
          if (response.status === 200) {
            allPermissions.push(...response.data);
          }
        }
        setRolesPermission(allPermissions);

        if (
          userPermissions &&
          userRoles &&
          supportService.haveSameElements(userRoles, roles) &&
          form.getValues("extra_permissions").length === 0
        ) {
          setSelectedPermissions(userPermissions);
          form.setValue(
            "extra_permissions",
            userPermissions.filter(
              (permission) =>
                !allPermissions
                  .map((permission) => permission.name)
                  .includes(permission),
            ),
          );
        } else {
          setSelectedPermissions(
            allPermissions
              .map((permission: Permission) => permission.name)
              .concat(form.getValues("extra_permissions")),
          );
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [userPermissions, userRoles, form],
  );

  useEffect(() => {
    if (roles.length > 0 && roles[0] !== "") {
      fetchRolesPermissions(roles);
    }
  }, [fetchRolesPermissions, roles]);

  const fetchPermissionModules = async () => {
    setIsLoading(true);
    try {
      const response = await permissionsService.modules();
      if (response.status === 200) {
        const modules: PermissionModule[] = response.data.modules;
        setPermissionModules(modules);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePermissions = () => {
    setIsLoading(true);
    try {
      const extraPermissions = selectedPermissions.filter(
        (permission) =>
          !rolesPermissions
            ?.map((permission) => permission.name)
            .includes(permission),
      );
      if (extraPermissions.length > 0) {
        form.setValue("extra_permissions", extraPermissions);
      }

      setIsOpen(false);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}
    >
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle autoFocus tabIndex={0}>
            Gerenciar permissões
          </DialogTitle>
          <DialogDescription>
            Gerenciar permissões do usuário
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="w-full flex justify-center">
            <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
          </div>
        ) : (
          <>
            <Accordion type="single" collapsible className="w-full">
              {permissionModules.map((module) => (
                <AccordionItem key={module.name} value={module.name}>
                  <AccordionTrigger>{module.name}</AccordionTrigger>
                  <AccordionContent>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full pl-8"
                    >
                      {module.groups.map((group) => (
                        <AccordionItem
                          className="border-b-0"
                          key={group.name}
                          value={group.name}
                        >
                          <AccordionTrigger>{group.name}</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-1">
                              {group.permissions.map((permission) => (
                                <div
                                  key={permission.name}
                                  className="grid grid-cols-4 items-center text-left gap-3"
                                >
                                  <div className="flex w-full justify-end">
                                    <Checkbox
                                      id={permission.name}
                                      className="border-tenant-primary data-[state=checked]:bg-tenant-primary"
                                      checked={selectedPermissions.includes(
                                        permission.name,
                                      )}
                                      value={permission.name}
                                      disabled={
                                        isLoading ||
                                        rolesPermissions
                                          .map((permission) => permission.name)
                                          .includes(permission.name)
                                      }
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedPermissions([
                                            ...selectedPermissions,
                                            permission.name,
                                          ]);
                                        } else {
                                          setSelectedPermissions(
                                            selectedPermissions.filter(
                                              (selected) =>
                                                selected !== permission.name,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                  <Label
                                    htmlFor={permission.name}
                                    className="col-span-3"
                                  >
                                    {permission.description}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button disabled={isLoading} type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                variant="tenantPrimary"
                disabled={isLoading}
                onClick={() => handleSavePermissions()}
              >
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
