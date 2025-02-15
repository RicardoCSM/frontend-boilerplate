export default interface QuestionnairesAnswer {
  questionnaire_id: string;
  questionnaires_group_id: string;
  family_id?: string;
  user_id?: string;
  version: number;
  status: "pending" | "completed";
  justification?: string;
  content: { [key: string]: string };
}
