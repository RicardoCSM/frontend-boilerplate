"use client";

import React from "react";
import QuestionnairesResponseHeader from "./_partials/QuestionnairesResponseHeader";

interface QuestionnaireResponseLayoutProps {
  children: React.ReactNode;
}

const QuestionnaireResponseLayout: React.FC<
  QuestionnaireResponseLayoutProps
> = ({ children }) => {
  return (
    <>
      <QuestionnairesResponseHeader />
      <div className="flex flex-1 flex-col gap-4  min-h-screen pt-16 overflow-y-auto bg-accent">
        {children}
      </div>
    </>
  );
};

export default QuestionnaireResponseLayout;
