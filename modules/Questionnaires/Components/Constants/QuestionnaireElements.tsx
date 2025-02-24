import { icons } from "lucide-react";
import { TextFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/TextField";
import { TitleFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/TitleField";
import { SubTitleFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/SubTitleField";
import { ParagraphFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/ParagraphField";
import { SeparatorFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/SeparatorField";
import { SpacerFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/SpacerField";
import { NumberFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/NumberField";
import { TextAreaFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/TextAreaField";
import { DateFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/DateField";
import { SelectFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/SelectField";
import { CheckboxFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/CheckboxField";
import { SwitchFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/SwitchField";
import { DateRangeFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/DateRangeField";
import { FileUploadFieldQuestionnaireElement } from "../QuestionnaireBuilder/Fields/FileUploadField";

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField"
  | "SwitchField"
  | "DateRangeField"
  | "FileUploadField";

export const VisualElements: ElementsType[] = [
  "TextField",
  "TitleField",
  "SubTitleField",
  "ParagraphField",
  "SeparatorField",
  "SpacerField",
];

export const InputElements: ElementsType[] = [
  "TextField",
  "NumberField",
  "TextAreaField",
  "DateField",
  "SelectField",
  "CheckboxField",
  "SwitchField",
  "DateRangeField",
  "FileUploadField",
];

export type SubmitFunction = (key: string, value: string) => void;
export type RenderFunction = (key: string) => void;

export type QuestionnaireElement = {
  type: ElementsType;
  construct: (id: string) => QuestionnaireElementInstance;
  designerBtnElement: {
    icon: keyof typeof icons;
    label: string;
  };
  designerComponent: React.FC<{
    elementInstance: QuestionnaireElementInstance;
  }>;
  questionnaireComponent: React.FC<{
    elementInstance: QuestionnaireElementInstance;
    submitValue?: SubmitFunction;
    defaultValue?: string;
    isInvalid?: QuestionnaireError[];
    disabled?: boolean;
    formValues?: { [key: string]: string };
    generateRenderKey?: RenderFunction;
    dependentElements?: string[];
  }>;
  propertiesComponent: React.FC<{
    elementInstance: QuestionnaireElementInstance;
  }>;

  validate: (
    questionnaireElement: QuestionnaireElementInstance,
    currentValue: string,
    formValues?: { [key: string]: string },
  ) => QuestionnaireError[];
};

export type QuestionnaireElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, unknown>;
  row: number;
  col: number;
};

export type QuestionnaireElementsType = {
  [key in ElementsType]: QuestionnaireElement;
};

export type QuestionnaireError = {
  type: "required" | "invalid";
  message: string;
};

export const QuestionnaireElements: QuestionnaireElementsType = {
  TextField: TextFieldQuestionnaireElement,
  TitleField: TitleFieldQuestionnaireElement,
  SubTitleField: SubTitleFieldQuestionnaireElement,
  ParagraphField: ParagraphFieldQuestionnaireElement,
  SeparatorField: SeparatorFieldQuestionnaireElement,
  SpacerField: SpacerFieldQuestionnaireElement,
  NumberField: NumberFieldQuestionnaireElement,
  TextAreaField: TextAreaFieldQuestionnaireElement,
  DateField: DateFieldQuestionnaireElement,
  SelectField: SelectFieldQuestionnaireElement,
  CheckboxField: CheckboxFieldQuestionnaireElement,
  SwitchField: SwitchFieldQuestionnaireElement,
  DateRangeField: DateRangeFieldQuestionnaireElement,
  FileUploadField: FileUploadFieldQuestionnaireElement,
};
