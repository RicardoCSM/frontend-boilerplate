import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 5 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const avatarSchema = z
  .unknown()
  .transform((value) => {
    return value as FileList | null | undefined;
  })
  .refine(
    (file) => {
      const fileSize = file?.item?.(0)?.size || 0;
      return fileSize <= MAX_FILE_SIZE || file?.length == 0;
    },
    { message: "O tamanho máximo do arquivo é 5MB!" },
  )
  .refine(
    (file) => {
      const fileType = file?.item?.(0)?.type || "";
      return ACCEPTED_IMAGE_TYPES.includes(fileType) || file?.length == 0;
    },
    {
      message: "Tipo de arquivo não suportado!",
    },
  );

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    login: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(20, { message: "É necessário no máximo 20 caractéres!" }),
    email: z
      .string({ required_error: "Campo Obrigatório!" })
      .email({ message: "Email inválido!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    password: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    role: z.string({ required_error: "É necessário selecionar um grupo!" }),
    password_confirmation: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    extra_permissions: z.array(z.string()).optional(),
    avatar: avatarSchema.optional(),
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

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z
  .object({
    name: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    login: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(20, { message: "É necessário no máximo 20 caractéres!" }),
    email: z
      .string({ required_error: "Campo Obrigatório!" })
      .email({ message: "Email inválido!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    password: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" })
      .optional()
      .or(z.literal("")),
    password_confirmation: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" })
      .optional()
      .or(z.literal("")),
    active: z.boolean(),
    roles: z
      .array(z.string().min(1))
      .min(1)
      .nonempty("Necessário selecionar pelo menos um grupo!"),
    extra_permissions: z.array(z.string()).optional(),
    avatar: avatarSchema.optional(),
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

export type EditUserSchema = z.infer<typeof editUserSchema>;

export const editCurrentUserSchema = z
  .object({
    name: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    login: z
      .string({ required_error: "Campo Obrigatório!" })
      .min(4, { message: "É necessário no mínimo 4 caractéres!" })
      .max(20, { message: "É necessário no máximo 20 caractéres!" }),
    email: z
      .string({ required_error: "Campo Obrigatório!" })
      .email({ message: "Email inválido!" })
      .max(255, { message: "É necessário no máximo 255 caractéres!" }),
    current_password: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .optional()
      .or(z.literal("")),
    password_confirmation: z
      .string()
      .min(8, { message: "É necessário no mínimo 8 caractéres!" })
      .optional()
      .or(z.literal("")),
    avatar: avatarSchema.optional(),
  })
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não se correspondem!",
      });
    }
  });

export type EditCurrentUserSchema = z.infer<
  typeof editCurrentUserSchema
>;
