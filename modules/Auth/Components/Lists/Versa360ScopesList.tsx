"use client";

import { Versa360Client, Versa360Scope } from "../../Interfaces/Versa360Client";
import Versa360ScopesListSidebar from "./_partials/Versa360ScopesListSidebar";
import Versa360ScopeGeneralInfo from "./_partials/Versa360ScopeGeneralInfo";
import { PermissionModule, Role } from "../../Interfaces/Role";
import { useCallback, useEffect, useState } from "react";
import Versa360ScopePermissionMapForm from "../Forms/Versa360ScopePermissionMapForm";
import { LoaderCircle } from "lucide-react";
import versa360Service from "../../Services/versa360.service";
import { Versa360ScopePermissionMap } from "../../Interfaces/Versa360ScopePermissionMap";
import useAuth from "../../Hooks/useAuth";
import { Separator } from "@/components/ui/separator";

interface Versa360ScopesListProps {
  versa360Client: Versa360Client;
  roles: Role[];
  permissionModules: PermissionModule[];
  selectedVersa360Scope: Versa360Scope | null;
  setSelectedVersa360Scope: (scope: Versa360Scope | null) => void;
}

const Versa360ScopesList: React.FC<Versa360ScopesListProps> = ({
  versa360Client,
  roles,
  permissionModules,
  selectedVersa360Scope,
  setSelectedVersa360Scope,
}) => {
  const { userData } = useAuth();
  const [versa360ScopePermissionMap, setVersa360ScopePermissionMap] =
    useState<Versa360ScopePermissionMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVersa360ScopePermissionMap = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await versa360Service.show(
        selectedVersa360Scope?.id ?? "",
      );

      if (response.status === 200) {
        setVersa360ScopePermissionMap(response.data);
      }
    } catch {
      setVersa360ScopePermissionMap(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVersa360Scope]);

  useEffect(() => {
    if (selectedVersa360Scope) {
      fetchVersa360ScopePermissionMap();
    }
  }, [selectedVersa360Scope, fetchVersa360ScopePermissionMap]);

  return (
    <div className="flex flex-col flex-1 w-full lg:p-4">
      <div className="flex w-full flex-grow relative overflow-y-auto h-[200px] space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 lg:px-4">
        <Versa360ScopesListSidebar
          versa360Client={versa360Client}
          selectedVersa360Scope={selectedVersa360Scope}
          setSelectedVersa360Scope={setSelectedVersa360Scope}
        />
        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="px-4 flex flex-col h-full space-y-4 w-full">
            {selectedVersa360Scope && (
              <>
                <Versa360ScopeGeneralInfo
                  versa360Client={versa360Client}
                  selectedVersa360Scope={selectedVersa360Scope}
                  versa360ScopePermissionMap={versa360ScopePermissionMap}
                  refreshVersa360ScopePermissionMap={
                    fetchVersa360ScopePermissionMap
                  }
                />
                <Separator />
                {userData?.permissions.includes(
                  "ALL-view-versa360-scope-permission-map",
                ) && (
                    <>
                      {isLoading ? (
                        <div className="w-full grow flex justify-center items-center">
                          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
                        </div>
                      ) : (
                        <Versa360ScopePermissionMapForm
                          roles={roles}
                          permissionModules={permissionModules}
                          selectedVersa360Scope={selectedVersa360Scope}
                          versa360ScopePermissionMap={versa360ScopePermissionMap}
                          refreshVersa360ScopePermissionMap={
                            fetchVersa360ScopePermissionMap
                          }
                        />
                      )}
                    </>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Versa360ScopesList;
