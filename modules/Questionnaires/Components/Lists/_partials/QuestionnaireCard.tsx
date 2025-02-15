"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import Questionnaire from "@/modules/Questionnaires/Interfaces/Questionnaire";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import QuestionnaireActionsDialog from "../../Dialogs/QuestionnaireActionsDialog";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import DeleteQuestionnairesDialog from "../../Dialogs/DeleteQuestionnairesDialog";

interface QuestionnaireCardProps {
  questionnaire: Questionnaire;
  refreshQuestionnaires: () => void;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  questionnaire,
  refreshQuestionnaires,
}) => {
  const { userData } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between w-full">
          <span className="flex items-center truncate font-bold">
            {questionnaire.icon && (
              <Icon name={questionnaire.icon} className="size-4 mr-2" />
            )}
            {questionnaire.title}
          </span>
          <span className="flex items-center gap-2">
            {questionnaire.active && (
              <Badge variant="tenantPrimary">Ativo</Badge>
            )}
            {!questionnaire.active && (
              <Badge variant="destructive">Inativo</Badge>
            )}
            {userData?.permissions.some(
              (permission) =>
                permission === "ALL-edit-questionnaires" ||
                permission === "ALL-view-questionnaires",
            ) && (
              <QuestionnaireActionsDialog
                questionnaire={questionnaire}
                refreshQuestionnaires={refreshQuestionnaires}
                mode={
                  userData?.permissions.includes("ALL-edit-questionnaires")
                    ? "edit"
                    : "view"
                }
              />
            )}
            {userData?.permissions.includes("ALL-delete-questionnaires") &&
              !questionnaire.active && (
                <DeleteQuestionnairesDialog
                  questionnaire={questionnaire}
                  refreshQuestionnaires={refreshQuestionnaires}
                />
              )}
          </span>
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {questionnaire.started_at &&
            formatDistance(questionnaire.started_at, new Date(), {
              addSuffix: true,
              locale: ptBR,
            })}
          <span>Versão: {questionnaire.version}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {questionnaire.description || "Sem descrição"}
      </CardContent>
      <CardFooter>
        {questionnaire.active &&
          userData?.permissions.includes(
            "ALL-view-questionnaire-responses",
          ) && (
            <Button
              asChild
              className="w-full mt-2 gap-4"
              variant="tenantPrimary"
            >
              <Link href={`/admin/questionnaires/${questionnaire.id}`}>
                <span className="flex items-center gap-4">
                  Visualizar respostas{" "}
                  <SquareArrowOutUpRight className="size-4" />
                </span>
              </Link>
            </Button>
          )}
        {!questionnaire.active &&
          userData?.permissions.includes("ALL-edit-questionnaires") && (
            <Button asChild className="w-full mt-2" variant="tenantSecondary">
              <Link href={`/admin/questionnaires/builder/${questionnaire.id}`}>
                <span className="flex items-center gap-4">
                  Editar Elementos <Edit className="size-4" />
                </span>
              </Link>
            </Button>
          )}
      </CardFooter>
    </Card>
  );
};

export default QuestionnaireCard;
