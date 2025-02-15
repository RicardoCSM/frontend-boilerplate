import * as z from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "O nome do grupo deve conter pelo menos 2 caractéres.",
    })
    .max(255, { message: "É necessário no máximo 255 caractéres!" }),
  description: z
    .string()
    .max(255, { message: "É necessário no máximo 255 caractéres!" })
    .optional(),
  permissions: z.array(z.string()),
});

export type RoleSchema = z.infer<typeof roleSchema>;
