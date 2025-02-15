"use client";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";
import Questionnaire from "../../Interfaces/Questionnaire";
import questionnairesService from "../../Services/questionnaires.service";
import QuestionnaireBuilder from "../QuestionnaireBuilder/QuestionnaireBuilder";
import QuestionnaireDetails from "../QuestionnaireDetails/QuestionnaireDetails";
import { useSearchParams } from "next/navigation";

interface QuestionnairesContainerProps {
  id?: string;
  mode: "view" | "edit";
}

const QuestionnairesContainer: React.FC<QuestionnairesContainerProps> = ({
  id,
  mode,
}) => {
  const params = useSearchParams();
  const version = params.get("version");
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();

  const fetchQuestionnaire = useCallback(async () => {
    try {
      const response = await questionnairesService.show(id ?? "", version);
      if (response.status === 200) {
        const questionnaire = response.data;
        setQuestionnaire(questionnaire);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id, version]);

  useEffect(() => {
    if (id) {
      fetchQuestionnaire();
    }
  }, [fetchQuestionnaire, id]);

  return (
    <>
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          {questionnaire ? (
            <>
              {mode === "edit" ? (
                <QuestionnaireBuilder questionnaire={questionnaire} />
              ) : (
                <QuestionnaireDetails questionnaire={questionnaire} />
              )}
            </>
          ) : (
            <div className="w-full grow flex justify-center items-center">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-[148px]">
                  <NoResultsFounded />
                </div>
                <h2 className="font-semibold text-2xl text-tenant-primary">
                  Nenhum questionário encontrado!
                </h2>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default QuestionnairesContainer;
