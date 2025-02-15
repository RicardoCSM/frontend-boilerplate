import * as z from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, { message: "Campo Obrigatório" }),
  number: z.string(),
  neighborhood: z.string().min(1, { message: "Campo Obrigatório" }),
  city: z.string().min(1, { message: "Campo Obrigatório" }),
  state: z.string().min(1, { message: "Campo Obrigatório" }),
  postal_code: z.string().min(8, { message: "O CEP deve ter 8 caracters" }),
});

export type AddressSchema = z.infer<typeof addressSchema>;
