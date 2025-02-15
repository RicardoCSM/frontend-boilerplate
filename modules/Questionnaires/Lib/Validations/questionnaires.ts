import { z } from "zod";

export const questionnairesSchema = z.object({
  questionnaires_group_id: z.string().optional(),
  title: z
    .string({ required_error: "Campo Obrigatório!" })
    .min(4, { message: "É necessário no mínimo 4 caractéres!" })
    .max(255, { message: "É necessário no máximo 255 caractéres!" }),
  description: z.string().optional(),
  icon: z.string().optional().nullable(),
  active: z.boolean().optional(),
  elements: z
    .array(
      z.object({
        type: z.string(),
        extraAttributes: z.record(z.string(), z.any()).optional(),
        row: z.number(),
        col: z.number(),
      }),
    )
    .optional(),
});

export type QuestionnairesSchema = z.infer<typeof questionnairesSchema>;
