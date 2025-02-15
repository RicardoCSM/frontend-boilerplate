"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "@/lib/utils";
import { ApiError } from "@/modules/Common/Interfaces/ApiError";
import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import questionnairesService from "@/modules/Questionnaires/Services/questionnaires.service";
import { LoaderCircle, SaveAll } from "lucide-react";
import { useState } from "react";

interface QuestionnaireBuilderSaveFormProps {
  id: string;
}

const QuestionnaireBuilderSaveForm: React.FC<
  QuestionnaireBuilderSaveFormProps
> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { elements } = useDesigner();

  const updateQuestionnaire = async () => {
    setIsLoading(true);
    try {
      const response = await questionnairesService.update(id, {
        elements,
      });

      if (response.status === 200) {
        toast({
          title: "Questionário atualizado com sucesso!",
        });
      }
    } catch (e: unknown) {
      if (isAxiosError<ApiError>(e)) {
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
    <Button
      onClick={updateQuestionnaire}
      disabled={isLoading}
      variant="tenantPrimary"
    >
      {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      <SaveAll className="size-4 mr-2" />
      Salvar
    </Button>
  );
};

export default QuestionnaireBuilderSaveForm;
