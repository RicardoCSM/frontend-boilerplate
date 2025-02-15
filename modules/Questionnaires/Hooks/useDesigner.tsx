"use client";

import { useContext } from "react";
import { QuestionnaireBuilderDesignerContext } from "../Providers/DesignerContextProvider";

const useDesigner = () => {
  const context = useContext(QuestionnaireBuilderDesignerContext);

  if (!context) {
    throw new Error(
      "useDesigner must be used within a DesignerContextProvider",
    );
  }

  return context;
};

export default useDesigner;
