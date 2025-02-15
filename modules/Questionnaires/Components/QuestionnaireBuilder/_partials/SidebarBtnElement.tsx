"use client";

import { Button } from "@/components/ui/button";
import { QuestionnaireElement } from "../../Constants/QuestionnaireElements";
import Icon from "@/modules/Common/Components/RootLayout/_partials/Icon";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface SidebarBtnElementProps {
  questionnaireElement: QuestionnaireElement;
}

const SidebarBtnElement: React.FC<SidebarBtnElementProps> = ({
  questionnaireElement,
}) => {
  const { label, icon } = questionnaireElement.designerBtnElement;
  const draggable = useDraggable({
    id: `questionnaire-btn-${questionnaireElement.type}`,
    data: {
      type: questionnaireElement.type,
      isSidebarBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      variant="tenantOutline"
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        draggable.isDragging && "ring-2 ring-tenant-primary",
      )}
      {...draggable.attributes}
      {...draggable.listeners}
    >
      <Icon name={icon} className="size-8 text-tenant-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay: React.FC<SidebarBtnElementProps> = ({
  questionnaireElement,
}) => {
  const { label, icon } = questionnaireElement.designerBtnElement;

  return (
    <Button
      variant="tenantOutline"
      className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab"
    >
      <Icon name={icon} className="size-8 text-tenant-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export default SidebarBtnElement;
