"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Versa360Client, Versa360Scope } from "../../Interfaces/Versa360Client";
import versa360Service from "../../Services/versa360.service";
import { LoaderCircle } from "lucide-react";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";
import Versa360ScopesList from "../Lists/Versa360ScopesList";
import permissionsService from "../../Services/permissions.service";
import { PermissionModule, Role } from "../../Interfaces/Role";
import rolesService from "../../Services/roles.service";

const Versa360ScopesListContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [versa360Client, setVersa360Client] = useState<Versa360Client>();
  const [selectedVersa360Scope, setSelectedVersa360Scope] =
    useState<Versa360Scope | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionModules, setPermissionModules] = useState<
    PermissionModule[]
  >([]);

  const fetchVersa360Client = useCallback(async () => {
    try {
      const response = await versa360Service.client();
      const client: Versa360Client = response.data;
      setVersa360Client(client);
      setSelectedVersa360Scope(client.workspace?.scopes[0] ?? null);
    } catch {
      toast({
        title: "Erro ao buscar cliente do Versa 360",
        description: "Não foi possível buscar o cliente do Versa 360",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await rolesService.index({ per_page: "all" });
      if (response.status === 200) {
        const roles: Role[] = response.data;
        setRoles(roles);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }, []);

  const fetchPermissionModules = useCallback(async () => {
    try {
      const response = await permissionsService.modules();
      if (response.status === 200) {
        const modules: PermissionModule[] = response.data.modules;
        setPermissionModules(modules);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchPermissionModules();
    fetchRoles();
    fetchVersa360Client();
  }, [fetchPermissionModules, fetchRoles, fetchVersa360Client]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          {versa360Client ? (
            <Versa360ScopesList
              versa360Client={versa360Client}
              selectedVersa360Scope={selectedVersa360Scope}
              setSelectedVersa360Scope={setSelectedVersa360Scope}
              permissionModules={permissionModules}
              roles={roles}
            />
          ) : (
            <div className="w-full grow flex justify-center items-center">
              <div className="w-full grow flex justify-center items-center">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-[148px]">
                    <NoResultsFounded />
                  </div>
                  <h2 className="font-semibold text-2xl text-tenant-primary">
                    Cliente não encontrado!
                  </h2>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Versa360ScopesListContainer;
