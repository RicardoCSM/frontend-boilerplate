export default interface QuestionnaireResponse {
  id: string;
  questionnaire_id: string;
  version: number;
  answers: { [key: string]: string };
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
}
