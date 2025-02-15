"use client";

import { Label } from "@/components/ui/label";
import {
  ElementsType,
  QuestionnaireElement,
  QuestionnaireElementInstance,
  QuestionnaireError,
  RenderFunction,
  SubmitFunction,
} from "../../Constants/QuestionnaireElements";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useEffect, useState } from "react";
import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import { Calendar } from "lucide-react";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "DateField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  conditions: Condition[];
} = {
  label: "Campo de Data",
  helperText: "Escolha uma data",
  required: false,
  conditions: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "Campo obrigatório!" }),
  helperText: z.string(),
  required: z.boolean().default(false),
  conditions: z.array(conditionSchema).default([]),
});

type CustomInstance = QuestionnaireElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DesignerComponent = ({
  elementInstance,
}: {
  elementInstance: QuestionnaireElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="truncate  max-w-[800px]">
        {label}
        {required && "*"}
      </Label>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
        disabled
      >
        <Calendar className="mr-2 h-4 w-4" />
        Selecione uma data
      </Button>
      {helperText && (
        <p className="text-[0.8rem] text-muted-foreground truncate">
          {helperText}
        </p>
      )}
    </div>
  );
};

const QuestionnaireComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
  formValues,
  generateRenderKey,
  disabled,
  dependentElements,
}: {
  elementInstance: QuestionnaireElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: QuestionnaireError[];
  defaultValue?: string;
  formValues?: { [key: string]: string };
  generateRenderKey?: RenderFunction;
  disabled?: boolean;
  dependentElements?: string[];
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const [errors, setErrors] = useState<QuestionnaireError[]>([]);
  const [visible, setVisible] = useState(true);

  const element = elementInstance as CustomInstance;
  const { label, helperText, required, conditions } = element.extraAttributes;

  useEffect(() => {
    setErrors(isInvalid || []);
  }, [isInvalid]);

  useEffect(() => {
    if (conditions && conditions.length > 0 && submitValue) {
      const shouldShow = conditions.every((condition) => {
        return verifyCondition(
          condition.operator,
          condition.value,
          formValues?.[condition.field] || "",
        );
      });
      if (!shouldShow) submitValue(element.id, "");
      setVisible(shouldShow);
    }
  }, [formValues, conditions, element.id, submitValue]);

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <DatePicker
        modal={submitValue ? false : true}
        disabled={disabled}
        error={errors.length > 0 ? true : undefined}
        date={value ? new Date(value) : undefined}
        setDate={(date: SetStateAction<Date | undefined>) => {
          if (date instanceof Date) {
            const formattedDate = date.toISOString();
            setValue(formattedDate);

            if (!submitValue) return;
            const errors = DateFieldQuestionnaireElement.validate(
              element,
              formattedDate,
            );
            setErrors(errors);
            submitValue(element.id, formattedDate);
            dependentElements?.forEach((element) =>
              generateRenderKey?.(element),
            );
          }
        }}
      />
      {helperText && (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      )}
      {errors.length > 0 && (
        <p className="text-[0.8rem] text-red-500">{errors[0].message}</p>
      )}
    </div>
  );
};

const PropertiesComponent = ({
  elementInstance,
}: {
  elementInstance: QuestionnaireElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { label, helperText, required, conditions } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Campo de Data atualizado com sucesso",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  error={form.formState.errors.label}
                />
              </FormControl>
              <FormDescription>
                Texto que será exibido como título do campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de Ajuda</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  error={form.formState.errors.label}
                />
              </FormControl>
              <FormDescription>
                Texto que será exibido como ajuda para o usuário preencher o
                campo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <PropertiesConditionsField elementId={element.id} />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Obrigatória</FormLabel>
                <FormDescription>
                  Marque se este campo deve ser preenchido obrigatoriamente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="tenantPrimary">
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export const DateFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "Calendar",
    label: "Campo de Data",
  },
  designerComponent: DesignerComponent,
  questionnaireComponent: QuestionnaireComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    questionnaireElement: QuestionnaireElementInstance,
    currentValue: string,
    formValues?: { [key: string]: string },
  ) => {
    const element = questionnaireElement as CustomInstance;
    const errors: QuestionnaireError[] = [];

    const shouldShow = element.extraAttributes.conditions.every((condition) => {
      return verifyCondition(
        condition.operator,
        condition.value,
        formValues?.[condition.field] || "",
      );
    });

    if (!shouldShow) {
      return errors;
    }

    if (element.extraAttributes.required && currentValue.length === 0) {
      errors.push({
        type: "required",
        message: "Este campo é obrigatório!",
      });
    } else if (currentValue && isNaN(Date.parse(currentValue))) {
      errors.push({
        type: "invalid",
        message: "Data inválida!",
      });
    }

    return errors;
  },
};
