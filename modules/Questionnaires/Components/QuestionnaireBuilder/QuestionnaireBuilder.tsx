"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import QuestionnaireBuilderDesigner from "./QuestionnaireBuilderDesigner";
import Questionnaire from "../../Interfaces/Questionnaire";
import { Separator } from "@/components/ui/separator";
import DragOverlayWrapper from "./_partials/DragOverlayWrapper";
import QuestionnaireBuilderPreviewDialog from "./_partials/QuestionnaireBuilderPreviewDialog";
import QuestionnaireBuilderSaveForm from "./_partials/QuestionnaireBuilderSaveForm";
import { useEffect } from "react";
import useDesigner from "../../Hooks/useDesigner";
import QuestionnaireBuilderActivateDialog from "./_partials/QuestionnaireBuilderActivateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clipboard, PartyPopper } from "lucide-react";
import Link from "next/link";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import { toast } from "@/hooks/use-toast";

interface QuestionnaireBuilderProps {
  questionnaire: Questionnaire;
}

const QuestionnaireBuilder: React.FC<QuestionnaireBuilderProps> = ({
  questionnaire,
}) => {
  const { setElements } = useDesigner();
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setElements(questionnaire.elements);
  }, [questionnaire, setElements]);

  if (questionnaire.active) {
    return (
      <div className="flex flex-col items-center justify-center grow w-full">
        <div className="max-w-md">
          <h1 className="flex items-center justify-between text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
            <PartyPopper />
            Questionário ativo
            <PartyPopper />
          </h1>
          <h2 className="text-2xl">Questionário ativado com sucesso</h2>
          <h3 className="text-xl text-muted-foreground border-b pb-10">
            O questionário está ativo e disponível para ser respondido pelos
            usuários.
          </h3>
          <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
            <Button
              className="w-full"
              variant="tenantPrimary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/questionnaires/${questionnaire.id}/response`,
                );
                toast({
                  title: "Link copiado para a área de transferência",
                });
              }}
            >
              <Clipboard className="size-4 mr-2" />
              Copiar link do questionário
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant="link" asChild>
              <Link
                href={`/admin/questionnaires?group_id=${questionnaire.questionnaires_group_id}`}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Visualizar informações do grupo
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href={`/admin/questionnaires/${questionnaire.id}`}
                className="gap-2"
              >
                Detalhes do questionário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <div className="flex flex-col flex-1 w-full ">
        <nav className="flex justify-between p-4 gap-3 items-center">
          <div className="flex flex-col gap-1 justify-start">
            <span className="flex items-center truncate font-medium gap-2">
              {questionnaire.icon && (
                <Icon name={questionnaire.icon} className="size-4" />
              )}
              {questionnaire.title}
            </span>
            <p className="text-tenant-primary text-sm">
              {questionnaire.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <QuestionnaireBuilderPreviewDialog />
            {!questionnaire.active && (
              <>
                <QuestionnaireBuilderSaveForm id={questionnaire.id} />
                <QuestionnaireBuilderActivateDialog id={questionnaire.id} />
              </>
            )}
          </div>
        </nav>
        <Separator />
        <div className="flex w-full flex-grow items-center justify-center overflow-y-hidden relative h-[200px] bg-accent">
          <QuestionnaireBuilderDesigner />
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default QuestionnaireBuilder;
