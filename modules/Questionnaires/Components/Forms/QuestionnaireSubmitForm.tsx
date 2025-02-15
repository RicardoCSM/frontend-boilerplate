"use client";

import Questionnaire from "../../Interfaces/Questionnaire";
import {
  QuestionnaireElements,
  QuestionnaireError,
} from "../Constants/QuestionnaireElements";
import { Button } from "@/components/ui/button";
import { Info, LoaderIcon, SaveAll } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import { v4 as uuidv4 } from "uuid";
import { Condition } from "@/modules/Common/Components/Constants/ConditionTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuestionnaireResponse from "../../Interfaces/QuestionnaireResponse";
import { QuestionnaireResponseSchema } from "../../Lib/Validations/questionnaireResponses";
import questionnaireResponsesService from "../../Services/questionnaireResponsesService";

interface QuestionnaireSubmitFormProps {
  questionnaire: Questionnaire;
  questionnaireResponse?: QuestionnaireResponse;
  mode: "view" | "create";
}

const QuestionnaireSubmitForm: React.FC<QuestionnaireSubmitFormProps> = ({
  questionnaire,
  questionnaireResponse,
  mode,
}) => {
  const questionnaireValues = useRef<{ [key: string]: string }>(
    questionnaireResponse?.answers ?? {},
  );
  const questionnaireErrors = useRef<{ [key: string]: QuestionnaireError[] }>(
    {},
  );
  const [questionnaireRenderKeys, setQuestionnaireRenderKeys] = useState<{
    [key: string]: string;
  }>(
    questionnaire.elements.reduce((acc: { [key: string]: string }, curr) => {
      acc[curr.id] = uuidv4();
      return acc;
    }, {}),
  );
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(
    questionnaireResponse ? true : false,
  );
  const [pending, startTransition] = useTransition();
  const startedAt = new Date().toISOString();

  const submitValue = useCallback((key: string, value: string) => {
    questionnaireValues.current[key] = value;
  }, []);
  const generateRenderKey = useCallback((key: string) => {
    setQuestionnaireRenderKeys((prevKeys) => ({
      ...prevKeys,
      [key]: uuidv4(),
    }));
  }, []);

  const validateQuestionnaire: () => boolean = useCallback(() => {
    for (const field of questionnaire.elements) {
      const actualValue = questionnaireValues.current[field.id] || "";
      const errors = QuestionnaireElements[field.type].validate(
        field,
        actualValue,
        questionnaireValues.current,
      );

      if (errors.length > 0) {
        questionnaireErrors.current[field.id] = errors;
      }
    }

    if (Object.keys(questionnaireErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [questionnaire.elements]);

  useEffect(() => {
    if (submitted) {
      validateQuestionnaire();
      setRenderKey(new Date().getTime());
    }
  }, [submitted, validateQuestionnaire]);

  const renderElements = () => {
    const rows = questionnaire?.elements.reduce((acc, curr) => {
      if (curr.row > acc) return curr.row;
      return acc;
    }, 0);

    const elementsByRow = Array.from({ length: rows }, (_, i) => {
      return questionnaire?.elements
        .filter((element) => element.row === i + 1)
        .sort((a, b) => a.col - b.col);
    });

    return elementsByRow.map((elements, i) => (
      <div key={i} className="flex flex-col md:flex-row gap-2">
        {elements.map((element) => {
          const ElementComponent =
            QuestionnaireElements[element.type].questionnaireComponent;

          const dependentElements = questionnaire.elements
            .filter((e) =>
              (e.extraAttributes?.conditions as Condition[]).some(
                (condition: Condition) => condition.field === element.id,
              ),
            )
            .map((e) => e.id);

          return (
            <ElementComponent
              key={questionnaireRenderKeys[element.id]}
              elementInstance={element}
              submitValue={submitValue}
              formValues={questionnaireValues.current}
              isInvalid={questionnaireErrors.current[element.id]}
              defaultValue={questionnaireValues.current[element.id]}
              disabled={submitted || pending}
              generateRenderKey={generateRenderKey}
              dependentElements={dependentElements}
            />
          );
        })}
      </div>
    ));
  };

  const submitForm = async () => {
    questionnaireErrors.current = {};
    const validQuestionnaire = validateQuestionnaire();
    if (!validQuestionnaire) {
      setRenderKey(new Date().getTime());

      toast({
        title: "Erro ao enviar formulário",
        description:
          "Verifique se todos os campos foram preenchidos corretamente",
        variant: "destructive",
      });

      return;
    }

    try {
      const data: QuestionnaireResponseSchema = {
        questionnaire_id: questionnaire.id,
        version: questionnaire.version,
        answers: questionnaireValues.current,
        started_at: startedAt,
      };

      const res = await questionnaireResponsesService.store(data);

      if (res.status === 201) {
        setSubmitted(true);
        toast({
          title: "Questionário enviado",
          description: "O questionário foi salvo com sucesso",
        });
      }
    } catch {
      toast({
        title: "Erro ao enviar questionário",
        description:
          "Ocorreu um erro ao enviar o questionário, tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-[800px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-3xl p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row items-center w-full justify-between">
          <span className="flex text-lg items-center truncate font-medium gap-2">
            {questionnaire.icon && <Icon name={questionnaire.icon} />}
            {questionnaire.title}
          </span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-5" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[400px]">
              {questionnaire.description}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col w-full flex-1 justify-between border rounded-md overflow-y-auto p-8">
          <div key={renderKey} className="flex flex-col gap-4 h-full w-full">
            {renderElements()}
          </div>
          {mode === "create" && (
            <div className="flex w-full justify-center gap-4 pt-4">
              {!submitted && (
                <Button
                  variant="tenantPrimary"
                  className="w-[160px]"
                  onClick={() => {
                    startTransition(submitForm);
                  }}
                  disabled={pending}
                >
                  {pending && <LoaderIcon className="size-4 mr-2" />}
                  <SaveAll className="size-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSubmitForm;
