"use client";

import { Separator } from "@/components/ui/separator";
import QuestionnairesGroup from "../../Interfaces/QuestionnairesGroup";
import QuestionnairesListSidebar from "./_partials/QuestionnairesListSidebar";
import QuestionnairesGroupGeneralInfo from "./_partials/QuestionnairesGroupGeneralInfo";
import CreateQuestionnaireDialog from "../Dialogs/CreateQuestionnaireDialog";
import React, { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import QuestionnaireCard from "./_partials/QuestionnaireCard";
import Questionnaire from "../../Interfaces/Questionnaire";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import questionnairesService from "../../Services/questionnaires.service";

interface QuestionnairesListProps {
  questionnairesGroups: QuestionnairesGroup[];
  refreshQuestionnairesGroups: (
    setFirstItemAsSelected?: boolean,
  ) => Promise<void>;
  selectedQuestionnairesGroup: QuestionnairesGroup | null;
  setSelectedQuestionnairesGroup: (group: QuestionnairesGroup | null) => void;
}

const QuestionnairesList: React.FC<QuestionnairesListProps> = ({
  questionnairesGroups,
  refreshQuestionnairesGroups,
  selectedQuestionnairesGroup,
  setSelectedQuestionnairesGroup,
}) => {
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  const fetchQuestionnaires = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await questionnairesService.index(
        {
          per_page: "all",
          sort_field: "title",
          sort_order: "asc",
        },
        [
          {
            key: "questionnaires_group_id",
            value: selectedQuestionnairesGroup?.id || "",
          },
        ],
      );

      if (response.status === 200) {
        setQuestionnaires(response.data);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuestionnairesGroup]);

  useEffect(() => {
    if (selectedQuestionnairesGroup) {
      fetchQuestionnaires();
    }
  }, [selectedQuestionnairesGroup, fetchQuestionnaires]);

  return (
    <div className="flex flex-col flex-1 w-full lg:p-4">
      <div className="flex flex-col lg:flex-row w-full flex-grow relative h-[200px] space-y-4 lg:space-x-12 lg:space-y-0 lg:px-4">
        {userData?.permissions.includes(
          "ALL-list-questionnaires-groups",
        ) && (
            <QuestionnairesListSidebar
              isLoading={isLoading}
              questionnairesGroups={questionnairesGroups}
              refreshQuestionnairesGroups={refreshQuestionnairesGroups}
              selectedQuestionnairesGroup={selectedQuestionnairesGroup}
              setSelectedQuestionnairesGroup={setSelectedQuestionnairesGroup}
            />
          )}
        <div className="flex-1 w-full h-full overflow-y-auto">
          <div className="px-4 flex flex-col h-full space-y-4 w-full">
            {selectedQuestionnairesGroup && (
              <>
                <QuestionnairesGroupGeneralInfo
                  selectedQuestionnairesGroup={selectedQuestionnairesGroup}
                  refreshQuestionnairesGroups={refreshQuestionnairesGroups}
                  setSelectedQuestionnairesGroup={
                    setSelectedQuestionnairesGroup
                  }
                />
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData?.permissions.includes(
                    "ALL-create-questionnaires",
                  ) && (
                      <CreateQuestionnaireDialog
                        selectedQuestionnairesGroup={selectedQuestionnairesGroup}
                      />
                    )}
                  {userData?.permissions.includes(
                    "ALL-list-questionnaires",
                  ) && (
                      <>
                        {isLoading ? (
                          <div className="w-full grow flex justify-center items-center">
                            <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
                          </div>
                        ) : (
                          <>
                            {questionnaires.map((questionnaire) => (
                              <QuestionnaireCard
                                key={questionnaire.id}
                                questionnaire={questionnaire}
                                refreshQuestionnaires={fetchQuestionnaires}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairesList;
