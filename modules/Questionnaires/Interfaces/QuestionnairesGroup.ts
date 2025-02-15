import { icons } from "lucide-react";

export default interface QuestionnairesGroup {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof icons | null;
  order: number;
  active: boolean;
}
