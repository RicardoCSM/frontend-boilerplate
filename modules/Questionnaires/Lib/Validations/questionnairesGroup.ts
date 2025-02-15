import { z } from "zod";

export const questionnairesGroupSchema = z.object({
  title: z
    .string({ required_error: "Campo Obrigatório!" })
    .min(4, { message: "É necessário no mínimo 4 caractéres!" })
    .max(255, { message: "É necessário no máximo 255 caractéres!" }),
  description: z.string().optional(),
  icon: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export type QuestionnairesGroupSchema = z.infer<
  typeof questionnairesGroupSchema
>;
