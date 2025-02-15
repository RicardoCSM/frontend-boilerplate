"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import QuestionnairesContainer from "@/modules/Questionnaires/Components/Containers/QuestionnairesContainer";

export default function AdminQuestionnairesBuilder({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminLayout
      pageTitle="Editar Questionário"
      path={[{ name: "Questionários", url: "/admin/questionnaires" }]}
      requiredPermission="edit-questionnaires"
    >
      <QuestionnairesContainer id={params.id} mode="edit" />
    </AdminLayout>
  );
}
