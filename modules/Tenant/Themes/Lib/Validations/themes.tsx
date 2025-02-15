import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 5 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageSchema = z
  .unknown()
  .transform((value) => {
    return value as File | null | undefined;
  })
  .refine(
    (file) => {
      const fileSize = file?.size || 0;
      return fileSize <= MAX_FILE_SIZE;
    },
    { message: "O tamanho máximo do arquivo é 5MB!" },
  )
  .refine(
    (file) => {
      const fileType = file?.type || "";
      return ACCEPTED_IMAGE_TYPES.includes(fileType);
    },
    {
      message: "Tipo de arquivo não suportado!",
    },
  );

export const themeSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Campo obrigatório" })
    .max(255, { message: "Máximo de 255 caracteres" }),
  primary_color_light: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .min(1, { message: "Campo obrigatório" }),
  primary_color_dark: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .min(1, { message: "Campo obrigatório" }),
  secondary_color_light: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .min(1, { message: "Campo obrigatório" }),
  secondary_color_dark: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .min(1, { message: "Campo obrigatório" }),
  institutional_website_url: z
    .string()
    .max(255, { message: "Máximo de 255 caracteres" }),
  app_store_url: z.string().max(255, { message: "Máximo de 255 caracteres" }),
  google_play_url: z.string().max(255, { message: "Máximo de 255 caracteres" }),
  active: z.boolean().optional(),
  primary_logo: imageSchema.optional().nullable(),
  contrast_primary_logo: imageSchema.optional().nullable(),
  favicon: imageSchema.optional().nullable(),
  reduced_logo: imageSchema.optional().nullable(),
  contrast_reduced_logo: imageSchema.optional().nullable(),
});

export type ThemeSchema = z.infer<typeof themeSchema>;
