"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import QuestionnairesContainer from "@/modules/Questionnaires/Components/Containers/QuestionnairesContainer";

export default function AdminQuestionnairesDetails({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout
      pageTitle="Detalhes do Questionário"
      path={[{ name: "Questionários", url: "/admin/questionnaires" }]}
      requiredPermission="view-questionnaires"
    >
      <QuestionnairesContainer id={params.id} mode="view" />
    </AdminLayout>
  );
}
