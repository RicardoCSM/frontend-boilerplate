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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Combobox } from "@/components/ui/combobox";

const type: ElementsType = "SelectField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  options: string[];
  conditions: Condition[];
} = {
  label: "Campo de Seleção",
  helperText: "Texto de ajuda",
  required: false,
  placeHolder: "Valor aqui...",
  options: [],
  conditions: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "Campo obrigatório!" }),
  helperText: z.string(),
  required: z.boolean().default(false),
  placeHolder: z
    .string()
    .max(50, { message: "O texto interior deve ter no máximo 50 caractéres!" }),
  options: z.array(z.string()).default([]),
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
  const { label, helperText, required, placeHolder } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="truncate  max-w-[800px]">
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
      </Select>
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
  defaultValue,
  formValues,
  isInvalid,
  generateRenderKey,
  disabled,
  dependentElements,
}: {
  elementInstance: QuestionnaireElementInstance;
  submitValue?: SubmitFunction;
  defaultValue?: string;
  formValues?: { [key: string]: string };
  isInvalid?: QuestionnaireError[];
  generateRenderKey?: RenderFunction;
  disabled?: boolean;
  dependentElements?: string[];
}) => {
  const [value, setValue] = useState(defaultValue || "");
  const [errors, setErrors] = useState<QuestionnaireError[]>([]);
  const [visible, setVisible] = useState(true);

  const element = elementInstance as CustomInstance;
  const { label, helperText, required, placeHolder, options, conditions } =
    element.extraAttributes;

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
      <Combobox
        modal={submitValue ? false : true}
        error={errors.length > 0 ? true : undefined}
        disabled={disabled}
        placeholder={placeHolder}
        options={options.map((option) => ({ value: option, label: option }))}
        selected={value}
        onChange={(event: string | string[]) => {
          const value = Array.isArray(event) ? event[0] : event;
          setValue(value);
          if (!submitValue) return;
          const errors = SelectFieldQuestionnaireElement.validate(
            element,
            value,
          );
          setErrors(errors);
          submitValue(element.id, value);
          dependentElements?.forEach((element) => generateRenderKey?.(element));
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
      placeHolder: element.extraAttributes.placeHolder,
      options: element.extraAttributes.options,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { label, helperText, required, placeHolder, options, conditions } =
      values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeHolder,
        options,
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Campo de seleção atualizado com sucesso",
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
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto interior</FormLabel>
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
                Texto que será exibido dentro do campo
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
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Opções</FormLabel>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setValue("options", field.value.concat("Nova opção"));
                  }}
                >
                  <PlusCircle className="size-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        form.setValue("options", field.value);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <XCircle className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Separator />
        <Button type="submit" variant="tenantPrimary">
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export const SelectFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "SquareMousePointer",
    label: "Campo de Seleção",
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
    }

    return errors;
  },
};
