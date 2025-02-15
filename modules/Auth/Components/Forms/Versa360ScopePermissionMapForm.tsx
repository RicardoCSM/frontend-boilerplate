"use client";

import { Versa360Scope } from "../../Interfaces/Versa360Client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PermissionsFormFields from "../Forms/_partials/PermissionsFormFields";
import { Permission, PermissionModule, Role } from "../../Interfaces/Role";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import rolesService from "../../Services/roles.service";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Versa360ScopePermissionMapSchema,
  versa360ScopePermissionMapSchema,
} from "../../Lib/Validations/versa360ScopePermissionMap";
import { Versa360ScopePermissionMap } from "../../Interfaces/Versa360ScopePermissionMap";
import { toast } from "@/hooks/use-toast";
import versa360Service from "../../Services/versa360.service";
import useAuth from "../../Hooks/useAuth";

interface Versa360ScopePermissionMapFormProps {
  roles: Role[];
  permissionModules: PermissionModule[];
  selectedVersa360Scope: Versa360Scope | null;
  versa360ScopePermissionMap: Versa360ScopePermissionMap | null;
  refreshVersa360ScopePermissionMap: () => void;
}

const Versa360ScopePermissionMapForm: React.FC<
  Versa360ScopePermissionMapFormProps
> = ({
  roles,
  permissionModules,
  selectedVersa360Scope,
  versa360ScopePermissionMap,
  refreshVersa360ScopePermissionMap,
}) => {
    const { userData } = useAuth();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<Versa360ScopePermissionMapSchema>({
      resolver: zodResolver(versa360ScopePermissionMapSchema),
      defaultValues: {
        scope_id: selectedVersa360Scope?.id ?? "",
        permissions: versa360ScopePermissionMap?.permissions ?? [],
      },
    });

    const fetchRolePermissions = useCallback(
      async (roles: string[]) => {
        setIsLoading(true);
        try {
          const permissionsSet = new Set(form.getValues("permissions"));
          for (const role of roles) {
            const response = await rolesService.permissions(role);
            if (response.status === 200) {
              const permissions: Permission[] = response.data;
              permissions.forEach((permission) =>
                permissionsSet.add(permission.name),
              );
            }
          }
          form.setValue("permissions", Array.from(permissionsSet));
        } catch (e: unknown) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      },
      [form],
    );

    useEffect(() => {
      fetchRolePermissions(selectedRoles);
    }, [fetchRolePermissions, selectedRoles]);

    async function onSubmit(values: Versa360ScopePermissionMapSchema) {
      setIsLoading(true);
      try {
        const response = versa360ScopePermissionMap
          ? await versa360Service.update(values.scope_id, {
            permissions: values.permissions,
          })
          : await versa360Service.store(values);

        if (response.status === 200 || response.status === 201) {
          refreshVersa360ScopePermissionMap();
          toast({
            title: "Permissões atualizadas",
            description: "As permissões do escopo foram atualizadas com sucesso",
            variant: "success",
          });
        }
      } catch {
        toast({
          title: "Erro ao atualizar permissões",
          description: "Não foi possível atualizar as permissões do escopo",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    return (
      <Form {...form}>
        <div className="space-y-2">
          <Label>Grupos de base</Label>
          <MultiSelect
            options={roles.map((role) => ({
              label: role.name,
              value: role.name,
            }))}
            onValueChange={(value) => setSelectedRoles(value)}
            isdisabled={isLoading}
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Selecione os grupos de base para as permissões
          </p>
        </div>
        <PermissionsFormFields
          disabled={isLoading}
          permissionModules={permissionModules}
        />
        {(userData?.permissions.includes(
          "ALL-edit-versa360-scope-permission-map",
        ) ||
          userData?.permissions.includes(
            "ALL-create-versa360-scope-permission-map",
          )) && (
            <div className="flex flex-1 items-end justify-center">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="tenantPrimary"
                disabled={isLoading}
              >
                Salvar Alterações
              </Button>
            </div>
          )}
      </Form>
    );
  };

export default Versa360ScopePermissionMapForm;
