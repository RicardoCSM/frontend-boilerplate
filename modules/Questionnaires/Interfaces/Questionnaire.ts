import { icons } from "lucide-react";
import { QuestionnaireElementInstance } from "../Components/Constants/QuestionnaireElements";

export default interface Questionnaire {
  id: string;
  questionnaires_group_id: string;
  title: string;
  description: string | null;
  version: number;
  max_version: number;
  icon: keyof typeof icons | null;
  order: number;
  active: boolean;
  elements: QuestionnaireElementInstance[];
  created_at: string;
  updated_at: string;
  started_at: string | null;
  expired_at: string | null;
}
