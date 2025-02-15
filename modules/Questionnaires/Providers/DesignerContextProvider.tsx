"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { QuestionnaireElementInstance } from "../Components/Constants/QuestionnaireElements";

type QuestionnaireBuilderDesignerContextType = {
  elements: QuestionnaireElementInstance[];
  setElements: Dispatch<SetStateAction<QuestionnaireElementInstance[]>>;
  addElement: (
    row: number,
    col: number,
    element: QuestionnaireElementInstance,
  ) => void;
  removeElement: (id: string) => void;
  selectedElement: QuestionnaireElementInstance | null;
  setSelectedElement: Dispatch<
    SetStateAction<QuestionnaireElementInstance | null>
  >;
  updateElement: (id: string, element: QuestionnaireElementInstance) => void;
};

export const QuestionnaireBuilderDesignerContext =
  createContext<QuestionnaireBuilderDesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [elements, setElements] = useState<QuestionnaireElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<QuestionnaireElementInstance | null>(null);

  const addElement = (
    row: number,
    col: number,
    element: QuestionnaireElementInstance,
  ) => {
    setElements((prev) => [...prev, { ...element, row, col }]);
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, element: QuestionnaireElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const elementIndex = newElements.findIndex(
        (element) => element.id === id,
      );
      newElements[elementIndex] = element;
      return newElements;
    });
  };

  return (
    <QuestionnaireBuilderDesignerContext.Provider
      value={{
        elements,
        setElements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
      }}
    >
      {children}
    </QuestionnaireBuilderDesignerContext.Provider>
  );
}
