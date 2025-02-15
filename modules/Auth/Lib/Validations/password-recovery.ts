import * as z from "zod";

export const forgotPasswordSchema = z.object({
  login: z.string().min(1, { message: "Campo obrigatório!" }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caracteres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" })
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula!")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula!")
      .regex(/\d/, "A senha deve conter pelo menos um número!")
      .regex(/[\W_]/, "A senha deve conter pelo menos um símbolo!")
      .refine((value) => value.length >= 8, {
        message: "A senha deve ter no mínimo 8 caracteres!",
      }),
    password_confirmation: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caracteres!" }),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não se correspondem!",
        path: ["password_confirmation"],
      });
    }
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordInterface {
  token: string;
  login: string;
  password: string;
  password_confirmation: string;
}
