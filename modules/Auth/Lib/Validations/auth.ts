import * as z from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, { message: "Campo obrigatório!" }),
  password: z.string().min(1, { message: "Campo obrigatório!" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
