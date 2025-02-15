"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import QuestionnairesGroup from "../../Interfaces/QuestionnairesGroup";
import QuestionnairesList from "../Lists/QuestionnairesList";
import questionnairesGroupsService from "../../Services/questionnairesGroups.service";
import { useSearchParams } from "next/navigation";

const QuestionnairesListContainer = () => {
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [questionnairesGroups, setQuestionnairesGroups] = useState<
    QuestionnairesGroup[]
  >([]);
  const [selectedQuestionnairesGroup, setSelectedQuestionnairesGroup] =
    useState<QuestionnairesGroup | null>(null);
  const groupId = params.get("group_id");

  const fetchQuestionnairesGroups = useCallback(
    async (setFirstItemAsSelected?: boolean) => {
      try {
        const response = await questionnairesGroupsService.index({
          per_page: "all",
        });

        if (response.status === 200) {
          setQuestionnairesGroups(response.data);
          if (
            (!selectedQuestionnairesGroup || setFirstItemAsSelected) &&
            response.data.length > 0
          ) {
            if (groupId) {
              const selectedGroup = response.data.find(
                (group: QuestionnairesGroup) => group.id === groupId,
              );
              setSelectedQuestionnairesGroup(selectedGroup);
            } else {
              setSelectedQuestionnairesGroup(response.data[0]);
            }
          }
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedQuestionnairesGroup, groupId],
  );

  useEffect(() => {
    fetchQuestionnairesGroups();
  }, [fetchQuestionnairesGroups]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          <QuestionnairesList
            questionnairesGroups={questionnairesGroups}
            refreshQuestionnairesGroups={fetchQuestionnairesGroups}
            selectedQuestionnairesGroup={selectedQuestionnairesGroup}
            setSelectedQuestionnairesGroup={setSelectedQuestionnairesGroup}
          />
        </>
      )}
    </>
  );
};

export default QuestionnairesListContainer;
