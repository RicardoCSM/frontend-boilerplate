import { z } from "zod";

export const ConditionTypes = [
  {
    label: "Faixa de Valores",
    value: "range",
  },
  {
    label: "Igual a",
    value: "equal_to",
  },
  {
    label: "Superior a",
    value: "greater_than",
  },
  {
    label: "No mínimo",
    value: "minimum",
  },
  {
    label: "Inferior a",
    value: "less_than",
  },
  {
    label: "No máximo",
    value: "maximum",
  },
  {
    label: "Diferente de",
    value: "not_equal_to",
  },
];

export const conditionSchema = z.object({
  field: z.string().min(2, { message: "Campo obrigatório!" }),
  value: z.string(),
  operator: z
    .string()
    .min(2, { message: "Campo obrigatório!" })
    .refine((value) => {
      return ConditionTypes.some((item) => item.value === value);
    }),
});

export type Condition = z.infer<typeof conditionSchema>;

export const verifyCondition = (
  operator: string,
  conditionValue: string,
  value: string,
) => {
  const conditionType = ConditionTypes.find((item) => item.value === operator);

  if (conditionType) {
    switch (conditionType.value) {
      case "equal_to":
        return value === conditionValue;
      case "greater_than":
        return value > conditionValue;
      case "minimum":
        return parseInt(value) >= parseInt(conditionValue);
      case "less_than":
        return parseInt(value) < parseInt(conditionValue);
      case "maximum":
        return parseInt(value) <= parseInt(conditionValue);
      case "not_equal_to":
        return value !== conditionValue;
      default:
        return false;
    }
  }

  return false;
};

export type ConditionType =
  | "range"
  | "equal_to"
  | "greater_than"
  | "minimum"
  | "less_than"
  | "maximum"
  | "not_equal_to";
