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
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { Separator } from "@/components/ui/separator";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Button } from "@/components/ui/button";

const type: ElementsType = "SwitchField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  conditions: Condition[];
} = {
  label: "Veracidade",
  helperText: "Texto de ajuda",
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
  const id = `switch-${element.id}`;

  return (
    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm w-full">
      <div className="space-y-0.5 truncate  max-w-[800px]">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}
      </div>
      <Switch id={id} checked={false} disabled />
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
  const [value, setValue] = useState<boolean>(defaultValue === "true");
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

  const id = `switch-${element.id}`;

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-3 shadow-sm w-full",
        errors.length > 0 && "border-red-500",
      )}
    >
      <div className="space-y-0.5">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}

        {errors.length > 0 && (
          <p className="text-[0.8rem] text-red-500">{errors[0].message}</p>
        )}
      </div>
      <Switch
        id={id}
        disabled={disabled}
        checked={value}
        onCheckedChange={(checked) => {
          let value = false;
          if (checked === true) value = true;

          setValue(value);
          if (!submitValue) return;
          const stringValue = value ? "true" : "false";
          const errors = SwitchFieldQuestionnaireElement.validate(
            element,
            stringValue,
          );

          setErrors(errors);
          submitValue(element.id, stringValue);
          dependentElements?.forEach((element) => generateRenderKey?.(element));
        }}
      />
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
      description: "Campo de veracidade atualizado com sucesso",
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

export const SwitchFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "ToggleRight",
    label: "Veracidade",
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

    if (element.extraAttributes.required && currentValue !== "true") {
      errors.push({
        type: "required",
        message: "Este campo é obrigatório!",
      });
    }

    return errors;
  },
};
