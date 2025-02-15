"use client";

import QuestionnairesResponseContainer from "@/modules/Questionnaires/Components/Containers/QuestionnaireResponseContainer";

export default function QuestionnaireResponse({
  params,
}: {
  params: { id: string };
}) {
  return (
    <QuestionnairesResponseContainer
      questionnaire_id={params.id}
      mode="create"
    />
  );
}
