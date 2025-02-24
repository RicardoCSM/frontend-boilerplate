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
import { Button } from "@/components/ui/button";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";

const type: ElementsType = "FileUploadField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  conditions: Condition[];
  acceptedMimeTypes: string[];
  maxSize: number;
} = {
  label: "Envio de Arquivo",
  helperText: "Escolha um arquivo para enviar",
  required: false,
  conditions: [],
  acceptedMimeTypes: [],
  maxSize: 1024 * 5 * 1024,
};

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "Campo obrigatório!" }),
  helperText: z.string(),
  required: z.boolean().default(false),
  conditions: z.array(conditionSchema).default([]),
  acceptedMimeTypes: z.array(z.string()).default([]),
  maxSize: z.number().default(1024 * 5 * 1024),
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
      <Input type="file" disabled />
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
  formValues,
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
      <Input type="file" error={errors.length > 0 ? true : undefined} />
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
  const [mimeOptions, setMimeOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      conditions: element.extraAttributes.conditions,
      acceptedMimeTypes: element.extraAttributes.acceptedMimeTypes,
      maxSize: element.extraAttributes.maxSize,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const {
      label,
      helperText,
      required,
      conditions,
      acceptedMimeTypes,
      maxSize,
    } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        conditions,
        acceptedMimeTypes,
        maxSize,
      },
    });
    toast({
      title: "Sucesso",
      description: "Campo de Arquivo atualizado com sucesso",
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
        <FormField
          control={form.control}
          name="acceptedMimeTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipos de Arquivo Aceitos</FormLabel>
              <FormControl>
                <MultiSelect
                  key={field.value.length}
                  options={mimeOptions}
                  onCreate={(value) => {
                    setMimeOptions([
                      ...mimeOptions,
                      { label: value, value: value },
                    ]);
                    field.onChange([...field.value, value]);
                  }}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormDescription>
                Tipos de arquivos que o usuário pode enviar, exemplo: image/png,
                application/pdf, text/csv e etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho Máximo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  error={form.formState.errors.maxSize}
                />
              </FormControl>
              <FormDescription>
                Tamanho máximo do arquivo em bytes, exemplo: 5242880 (5MB)
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

export const FileUploadFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "File",
    label: "Envio de Arquivo",
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

    if (element.extraAttributes.required) {
      errors.push({
        type: "required",
        message: "Este campo é obrigatório!",
      });
    } else if (currentValue) {
    }

    return errors;
  },
};
