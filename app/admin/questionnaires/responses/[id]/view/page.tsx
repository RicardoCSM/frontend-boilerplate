"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import QuestionnaireResponseContainer from "@/modules/Questionnaires/Components/Containers/QuestionnaireResponseContainer";

export default function AdminQuestionnaireResponseView({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout
      pageTitle="Visualizar Resposta"
      path={[{ name: "Questionários", url: "/admin/questionnaires" }]}
      requiredPermission="view-questionnaire-responses"
    >
      <QuestionnaireResponseContainer mode="view" id={params.id} />
    </AdminLayout>
  );
}
