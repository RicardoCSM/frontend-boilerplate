"use client";

import { useCallback, useEffect, useState } from "react";
import NoResultsFounded from "@/modules/Common/Components/RootLayout/Icons/NoResultsFounded";
import ErrorLayout from "@/modules/Common/Components/RootLayout/ErrorLayout/ErrorLayout";
import LoadingComponent from "@/modules/Common/Components/RootLayout/_partials/LoadingComponent";
import { LoaderCircle } from "lucide-react";
import Questionnaire from "../../Interfaces/Questionnaire";
import questionnairesService from "../../Services/questionnaires.service";
import QuestionnaireResponse from "../QuestionnaireResponse/QuestionnaireResponse";
import questionnaireResponsesService from "../../Services/questionnaireResponsesService";
import { default as QuestionnaireResponseType } from "../../Interfaces/QuestionnaireResponse";
import QuestionnaireSubmitForm from "../Forms/QuestionnaireSubmitForm";

interface QuestionnaireResponseContainerProps {
  id?: string;
  questionnaire_id?: string;
  mode: "view" | "create";
}

const QuestionnaireResponseContainer: React.FC<
  QuestionnaireResponseContainerProps
> = ({ id, questionnaire_id, mode }) => {
  const [response, setResponse] = useState<QuestionnaireResponseType | null>(
    null,
  );
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestionnaire = useCallback(
    async (id?: string, version?: string) => {
      try {
        const response = await questionnairesService.show(
          id ? id : (questionnaire_id ?? ""),
          version,
        );
        if (response.status === 200) {
          const questionnaire = response.data;
          setQuestionnaire(questionnaire);
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [questionnaire_id],
  );

  const fetchResponse = useCallback(async () => {
    try {
      const res = await questionnaireResponsesService.show(id ?? "");
      if (res.status === 200) {
        const response: QuestionnaireResponseType = res.data;
        setResponse(response);
        await fetchQuestionnaire(
          response.questionnaire_id,
          response.version.toString(),
        );
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [fetchQuestionnaire, id]);

  useEffect(() => {
    if (mode === "view") {
      fetchResponse();
    } else {
      fetchQuestionnaire();
    }
  }, [fetchQuestionnaire, fetchResponse, mode]);

  return (
    <>
      {isLoading ? (
        <>
          {mode === "create" ? (
            <LoadingComponent />
          ) : (
            <div className="w-full grow flex justify-center items-center">
              <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
            </div>
          )}
        </>
      ) : (
        <>
          {questionnaire ? (
            <>
              {mode === "view" ? (
                <>
                  {response && (
                    <QuestionnaireSubmitForm
                      questionnaire={questionnaire}
                      questionnaireResponse={response}
                      mode="view"
                    />
                  )}
                </>
              ) : (
                <QuestionnaireResponse questionnaire={questionnaire} />
              )}
            </>
          ) : (
            <ErrorLayout
              statusCode={404}
              title="Questionário não encontrado"
              description="a página que você está procurando não foi encontrada."
              icon={<NoResultsFounded />}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuestionnaireResponseContainer;
