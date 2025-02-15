import { z } from "zod";

export const questionnaireResponseSchema = z.object({
  questionnaire_id: z.string().min(1, { message: "Campo obrigatório." }),
  version: z.number({required_error: "Campo obrigatório."}),
  answers: z.record(z.string().min(1, { message: "Campo obrigatório." })),
  started_at: z.string().min(1, { message: "Campo obrigatório." }),
});

export type QuestionnaireResponseSchema = z.infer<typeof questionnaireResponseSchema>;
