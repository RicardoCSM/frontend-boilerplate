"use client";

import { Separator } from "@/components/ui/separator";
import { QuestionnaireElements } from "../../Constants/QuestionnaireElements";
import SidebarBtnElement from "./SidebarBtnElement";

const QuestionnaireElementsSidebar = () => {
  return (
    <div>
      <p className="text-sm text-foreground/70">Arraste e solte elementos</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Elementos Visuais
        </p>
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.TitleField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.SubTitleField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.ParagraphField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.SeparatorField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.SpacerField}
        />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Questões
        </p>
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.TextField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.NumberField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.TextAreaField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.DateField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.DateRangeField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.SelectField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.CheckboxField}
        />
        <SidebarBtnElement
          questionnaireElement={QuestionnaireElements.SwitchField}
        />
      </div>
    </div>
  );
};

export default QuestionnaireElementsSidebar;
