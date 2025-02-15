"use client";

import Questionnaire from "../../Interfaces/Questionnaire";
import { Separator } from "@/components/ui/separator";
import QuestionnaireDetailsViewDialog from "./_partials/QuestionnaireDetailsViewDialog";
import QuestionnaireDetailsDeactivateForm from "./_partials/QuestionnaireDetailsDeactivateForm";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import { useRouter } from "next/navigation";
import QuestionnaireDetailsVersionDropdown from "./_partials/QuestionnaireDetailsVersionDropdown";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Clipboard } from "lucide-react";
import useAuth from "@/modules/Auth/Hooks/useAuth";
import QuestionnaireResponsesTable from "../Tables/QuestionnaireResponsesTable";

interface QuestionnaireDetailsProps {
  questionnaire: Questionnaire;
}

const QuestionnaireDetails: React.FC<QuestionnaireDetailsProps> = ({
  questionnaire,
}) => {
  const { userData } = useAuth();
  const router = useRouter();

  if (!questionnaire.active) {
    router.push(`/admin/questionnaires/builder${questionnaire.id}`);
    return null;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex w-full items-center py-3 border-muted">
        <div className="flex w-full flex-col lg:flex-row gap-2 justify-between px-3">
          <div className="flex items-center gap-2 text-4xl text-tenant-primary font-bold">
            <div>
              {questionnaire.icon && <Icon name={questionnaire.icon} />}
            </div>
            {questionnaire.title}
            <div className="flex items-center">
              <QuestionnaireDetailsVersionDropdown
                questionnaireId={questionnaire.id}
                version={questionnaire.version}
                max_version={questionnaire.max_version}
              />
            </div>
          </div>
          <div className="flex justify-center lg:justify-normal items-center gap-2">
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
              Copiar link
            </Button>
            <QuestionnaireDetailsViewDialog elements={questionnaire.elements} />
            <QuestionnaireDetailsDeactivateForm id={questionnaire.id} />
          </div>
        </div>
      </div>
      <Separator />
      {userData &&
        userData.permissions.includes("ALL-list-questionnaire-responses") && (
          <QuestionnaireResponsesTable questionnaire={questionnaire} />
        )}
    </div>
  );
};

export default QuestionnaireDetails;
