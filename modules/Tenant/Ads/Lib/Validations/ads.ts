import { z } from "zod";

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

export const adsSchema = z.object({
  background_image: imageSchema.optional(),
  button_text: z
    .string()
    .max(255, { message: "No máximo 255 caracteres!" })
    .optional(),
  button_url: z
    .string()
    .max(255, { message: "No máximo 255 caracteres!" })
    .optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  active: z.boolean().optional(),
});

export type AdsSchema = z.infer<typeof adsSchema>;

export const adsReorderSchema = z.object({
  ids: z.array(z.string()),
});

export type AdsReorderSchema = z.infer<typeof adsReorderSchema>;