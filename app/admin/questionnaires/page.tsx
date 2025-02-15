"use client";

import AdminLayout from "@/modules/Common/Components/AdminLayout/AdminLayout";
import QuestionnairesListContainer from "@/modules/Questionnaires/Components/Containers/QuestionnairesListContainer";

export default function AdminQuestionnaires() {
  return (
    <AdminLayout pageTitle="Questionários" requiredPermission="questionnaires">
      <QuestionnairesListContainer />
    </AdminLayout>
  );
}
