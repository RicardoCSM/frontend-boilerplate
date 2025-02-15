"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import CreateQuestionnairesGroupDialog from "../../Dialogs/CreateQuestionnairesGroupDialog";
import QuestionnairesGroup from "@/modules/Questionnaires/Interfaces/QuestionnairesGroup";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface QuestionnairesListSidebar {
  isLoading: boolean;
  questionnairesGroups: QuestionnairesGroup[];
  refreshQuestionnairesGroups: (
    setFirstItemAsSelected?: boolean,
  ) => Promise<void>;
  selectedQuestionnairesGroup: QuestionnairesGroup | null;
  setSelectedQuestionnairesGroup: (group: QuestionnairesGroup) => void;
}

const QuestionnairesListSidebar: React.FC<QuestionnairesListSidebar> = ({
  isLoading,
  questionnairesGroups,
  refreshQuestionnairesGroups,
  selectedQuestionnairesGroup,
  setSelectedQuestionnairesGroup,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { userData } = useAuth();

  return (
    <>
      {isLargeScreen ? (
        <aside className="-mx-4 w-1/6 pr-2 h-full overflow-y-auto">
          <nav className="flex space-x-2 flex-col space-y-2 ">
            <h4 className="text-sm font-medium text-tenant-primary">Grupos de Questionários</h4>
            {questionnairesGroups &&
              questionnairesGroups.map((item) => (
                <div
                  className="flex justify-between w-full items-center"
                  key={item.id}
                >
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant={
                      selectedQuestionnairesGroup?.id === item.id
                        ? "tenantSecondary"
                        : "tenantOutline"
                    }
                    className="w-full flex justify-between"
                    onClick={() => {
                      setSelectedQuestionnairesGroup(item);
                    }}
                  >
                    {item.icon && (
                      <span>
                        <Icon name={item.icon} className="size-4 mr-2" />
                      </span>
                    )}
                    <p className="w-full text-left text-ellipsis overflow-hidden">
                      {item.title}
                    </p>
                  </Button>
                </div>
              ))}
            {userData?.permissions.includes(
              "ALL-create-questionnaires-groups",
            ) && (
                <div className="flex justify-between w-full items-center">
                  <CreateQuestionnairesGroupDialog
                    refreshQuestionnairesGroups={refreshQuestionnairesGroups}
                    setSelectedQuestionnairesGroup={
                      setSelectedQuestionnairesGroup
                    }
                  />
                </div>
              )}
          </nav>
        </aside>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex w-full justify-center pt-4">
              <Button variant="tenantPrimary">Selecionar grupo de questionários</Button>
            </div>
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Selecionar grupo de questionários</SheetTitle>
            </SheetHeader>
            <nav className="flex mt-2 flex-col space-y-2">
              {questionnairesGroups &&
                questionnairesGroups.map((item) => (
                  <div
                    className="flex justify-between w-full items-center"
                    key={item.id}
                  >
                    <Button
                      disabled={isLoading}
                      type="button"
                      variant={
                        selectedQuestionnairesGroup?.id === item.id
                          ? "tenantSecondary"
                          : "tenantOutline"
                      }
                      className="w-full flex justify-between"
                      onClick={() => {
                        setSelectedQuestionnairesGroup(item);
                      }}
                    >
                      {item.icon && (
                        <span>
                          <Icon name={item.icon} className="size-4 mr-2" />
                        </span>
                      )}
                      <p className="w-full text-left text-ellipsis overflow-hidden">
                        {item.title}
                      </p>
                    </Button>
                  </div>
                ))}
              {userData?.permissions.includes(
                "ALL-create-questionnaires-groups",
              ) && (
                  <div className="flex justify-between w-full items-center">
                    <CreateQuestionnairesGroupDialog
                      refreshQuestionnairesGroups={refreshQuestionnairesGroups}
                      setSelectedQuestionnairesGroup={
                        setSelectedQuestionnairesGroup
                      }
                    />
                  </div>
                )}
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default QuestionnairesListSidebar;
