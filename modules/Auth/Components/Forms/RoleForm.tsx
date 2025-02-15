"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Permission, PermissionModule, Role } from "../../Interfaces/Role";
import rolesService from "../../Services/roles.service";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import PermissionsFormFields from "./_partials/PermissionsFormFields";
import { RoleSchema, roleSchema } from "../../Lib/Validations/role";
import FormLayout from "@/modules/Common/Components/AdminLayout/FormLayout/FormLayout";
import supportService from "@/modules/Common/Services/support.service";
import useAuth from "../../Hooks/useAuth";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";

interface RoleFormProps {
  mode?: "create" | "edit" | "view";
  role?: Role;
  permissions?: Permission[];
  permissionModules: PermissionModule[];
}

const RoleForm: React.FC<RoleFormProps> = ({
  mode = "create",
  role,
  permissions,
  permissionModules,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userData, refreshUserData } = useAuth();
  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissions: permissions?.map((permission) => permission.name) || [],
    },
  });

  async function onSubmit(values: RoleSchema) {
    if (mode === "create") {
      await createRole(values);
    } else {
      await editRole(values);
    }
  }

  const createRole = async (values: RoleSchema) => {
    setIsLoading(true);
    try {
      const data = supportService.removeEmptyValues(values);

      const response = await rolesService.store({
        name: data.name,
        description: data.description,
      });

      if (response.status === 201) {
        if (data.permissions.length > 0) {
          await rolesService.syncPermissions(
            response.data.name,
            data.permissions,
          );
        }
        form.reset();
        toast({
          title: "Grupo adicionado com sucesso",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof RoleSchema, {
              type: "manual",
              message: value,
            });
          });
        }
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const editRole = async (values: RoleSchema) => {
    setIsLoading(true);
    try {
      const excludedKeys = ["permissions"];
      const updatedData = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            !excludedKeys.includes(key) &&
            role &&
            value !== role[key as keyof Role],
        ),
      ) as Partial<RoleSchema>;

      const response = await rolesService.update(role?.name ?? "", updatedData);
      if (response.status === 200) {
        await rolesService.syncPermissions(
          response.data.name,
          values.permissions,
        );
        toast({
          title: "Grupo atualizado com sucesso",
        });
      }

      if (userData?.roles.includes(role?.name ?? "")) {
        await refreshUserData();
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
        if (e.response?.data.errors) {
          Object.entries(e.response.data.errors).forEach(([key, value]) => {
            form.setError(key as keyof RoleSchema, {
              type: "manual",
              message: value,
            });
          });
        }
        toast({
          title: "Algo deu errado.",
          description: e.response?.data.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout
      title="Grupo"
      form={form}
      mode={mode}
      onSubmit={onSubmit}
      isLoading={isLoading}
      backUrl="/admin/access/roles"
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input
                error={form.formState.errors.name}
                disabled={mode == "view" || isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Esse é o nome do grupo de permissões. Ex: Administrador,
              Assistente Social, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input
                error={form.formState.errors.description}
                disabled={mode == "view" || isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Essa é a descrição do grupo de permissões. Ex: Grupo de permissões
              para administradores.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <PermissionsFormFields
        permissionModules={permissionModules}
        disabled={mode == "view" || isLoading}
      />
    </FormLayout>
  );
};

export default RoleForm;
