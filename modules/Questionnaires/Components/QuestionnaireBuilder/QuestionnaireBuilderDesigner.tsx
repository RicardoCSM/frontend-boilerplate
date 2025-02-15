"use client";

import { cn } from "@/lib/utils";
import QuestionnaireBuilderSidebar from "./_partials/QuestionnaireBuilderSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import {
  ElementsType,
  QuestionnaireElementInstance,
  QuestionnaireElements,
} from "../Constants/QuestionnaireElements";
import useDesigner from "../../Hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const QuestionnaireBuilderDesigner = () => {
  const [renderedElements, setRenderedElements] = useState<JSX.Element[]>([]);
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
    updateElement,
  } = useDesigner();
  const droppable = useDroppable({
    id: "questionnaire-builder-drop-area",
    data: {
      isDesignerBuilderDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) {
        return;
      }

      const isSidebarBtnElement = active.data?.current?.isSidebarBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerBuilderDropArea;

      const droppingSidebarBtnOverDesignerDropArea =
        isSidebarBtnElement && isDroppingOverDesignerDropArea;

      const biggestRow = elements.reduce((acc, curr) => {
        if (curr.row > acc) return curr.row;
        return acc;
      }, 0);

      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type as ElementsType;
        const newElement = QuestionnaireElements[type].construct(uuidv4());

        addElement(biggestRow + 1, 1, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementLeftHalf =
        over.data?.current?.isLeftHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElementRightHalf =
        over.data?.current?.isRightHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementLeftHalf ||
        isDroppingOverDesignerElementBottomHalf ||
        isDroppingOverDesignerElementRightHalf;

      const droppingSidebarBtnOverDesignerElement =
        isSidebarBtnElement && isDroppingOverDesignerElement;

      const addNewElement = (
        overElement: QuestionnaireElementInstance,
        newElement: QuestionnaireElementInstance,
      ) => {
        let rowForNewElement = overElement.row;
        let colForNewElement = overElement.col;

        if (isDroppingOverDesignerElementBottomHalf) {
          rowForNewElement += 1;
          colForNewElement = 1;
          elements
            .filter((element) => element.row >= rowForNewElement)
            .forEach((element) => {
              updateElement(element.id, {
                ...element,
                row: element.row + 1,
              });
            });
        } else if (isDroppingOverDesignerElementTopHalf) {
          elements
            .filter((element) => element.row >= rowForNewElement)
            .forEach((element) => {
              updateElement(element.id, {
                ...element,
                row: element.row + 1,
              });
            });
        } else if (isDroppingOverDesignerElementRightHalf) {
          colForNewElement += 1;
        } else if (isDroppingOverDesignerElementLeftHalf) {
          colForNewElement = 1;
          updateElement(overElement.id, {
            ...overElement,
            col: 2,
          });
        }

        const elementsInRow = elements.filter(
          (element) => element.row === rowForNewElement,
        );
        if (elementsInRow.length >= 2) {
          rowForNewElement = biggestRow + 1;
          colForNewElement = 1;
        }

        addElement(rowForNewElement, colForNewElement, newElement);
      };

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type as ElementsType;
        const newElement = QuestionnaireElements[type].construct(uuidv4());

        const overId = over.data?.current?.elementId;

        const overElement = elements.find((element) => element.id === overId);
        if (!overElement) return;

        addNewElement(overElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverDesignerElement =
        isDraggingDesignerElement && isDroppingOverDesignerElement;

      if (draggingDesignerElementOverDesignerElement) {
        const overId = over.data?.current?.elementId;
        const activeId = active.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (element) => element.id === activeId,
        );

        const overElement = elements.find((element) => element.id === overId);
        const activeElement = { ...elements[activeElementIndex] };

        if (!overElement || !activeElement) return;

        removeElement(activeId);

        addNewElement(overElement, activeElement);
      }
    },
  });

  const renderElements = useCallback(() => {
    const rows = elements.reduce((acc, curr) => {
      if (curr.row > acc) return curr.row;
      return acc;
    }, 0);

    const elementsByRow = Array.from({ length: rows }, (_, i) => {
      return elements
        .filter((element) => element.row === i + 1)
        .sort((a, b) => a.col - b.col);
    });

    setRenderedElements(
      elementsByRow.map((row, i) => (
        <div
          key={i}
          className={cn("grid gap-2 auto-cols-max", "grid-cols-" + row.length)}
        >
          {row.map((element) => (
            <DesignerElementWrapper key={element.id} element={element} />
          ))}
        </div>
      )),
    );
  }, [elements]);

  useEffect(() => {
    renderElements();
  }, [elements, renderElements]);

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-tenant-primary ring-inset",
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Solte aqui
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded bg-tenant-primary/20" />
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {renderedElements}
            </div>
          )}
        </div>
      </div>
      <QuestionnaireBuilderSidebar />
    </div>
  );
};

const DesignerElementWrapper = ({
  element,
}: {
  element: QuestionnaireElementInstance;
}) => {
  const { removeElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const leftHalf = useDroppable({
    id: element.id + "-left",
    data: {
      type: element.type,
      elementId: element.id,
      isLeftHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const rightHalf = useDroppable({
    id: element.id + "-right",
    data: {
      type: element.type,
      elementId: element.id,
      isRightHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = QuestionnaireElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute bottom-0 w-full h-1/2 rounded-b-md"
      />
      <div
        ref={leftHalf.setNodeRef}
        className="absolute left-0 w-1/4 h-full rounded-l-md"
      />
      <div
        ref={rightHalf.setNodeRef}
        className="absolute right-0 w-1/4 h-full rounded-r-md"
      />
      {mouseIsOver &&
        !topHalf.isOver &&
        !bottomHalf.isOver &&
        !leftHalf.isOver &&
        !rightHalf.isOver && (
          <>
            <div className="absolute right-0 h-full">
              <Button
                className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(element.id);
                }}
              >
                <Trash className="size-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
              <p className="text-muted-foreground text-sm">
                Clique para acessar as propriedades ou segure para mover
              </p>
            </div>
          </>
        )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none" />
      )}
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
      {leftHalf.isOver && (
        <div className="absolute left-0 w-[7px] h-full rounded-md bg-primary rounded-r-none" />
      )}
      {rightHalf.isOver && (
        <div className="absolute right-0 w-[7px] h-full rounded-md bg-primary rounded-l-none" />
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>{" "}
    </div>
  );
};

export default QuestionnaireBuilderDesigner;
