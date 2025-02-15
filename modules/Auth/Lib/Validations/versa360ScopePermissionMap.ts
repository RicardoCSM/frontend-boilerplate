import * as z from "zod";

export const versa360ScopePermissionMapSchema = z.object({
  scope_id: z.string(),
  permissions: z.array(z.string()),
});

export type Versa360ScopePermissionMapSchema = z.infer<
  typeof versa360ScopePermissionMapSchema
>;
