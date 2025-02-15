"use client";

import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import QuestionnaireElementsSidebar from "./QuestionnaireElementsSidebar";
import PropertiesQuestionnaireSidebar from "./PropertiesQuestionnaireSidebar";

const QuestionnaireBuilderSidebar = () => {
  const { selectedElement } = useDesigner();

  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {!selectedElement && <QuestionnaireElementsSidebar />}
      {selectedElement && <PropertiesQuestionnaireSidebar />}
    </aside>
  );
};

export default QuestionnaireBuilderSidebar;
