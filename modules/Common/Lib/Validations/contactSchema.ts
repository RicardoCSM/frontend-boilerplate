import * as z from "zod";

export const contactSchema = z.object({
  type: z.string().min(1, { message: "Campo Obrigatório" }),
  value: z.string().min(1, { message: "Campo Obrigatório" }),
});

export type ContactSchema = z.infer<typeof contactSchema>;
