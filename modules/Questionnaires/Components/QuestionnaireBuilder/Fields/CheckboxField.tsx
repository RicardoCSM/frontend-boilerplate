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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { MultiSelect } from "@/components/ui/multi-select";

const type: ElementsType = "CheckboxField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  options: string[];
  conditions: Condition[];
} = {
  label: "Múltipla escolha",
  helperText: "Texto de ajuda",
  required: false,
  placeHolder: "Selecione uma opção",
  options: [],
  conditions: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "Campo obrigatório!" }),
  helperText: z.string(),
  required: z.boolean().default(false),
  placeHolder: z.string(),
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
  const { label, helperText, required } = element.extraAttributes;

  return (
    <div className="flex items-center space-x-2 truncate">
      <Checkbox disabled checked />
      <div>
        <Label className="truncate">
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}
      </div>
    </div>
  );
};

const QuestionnaireComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
  formValues,
  disabled,
  generateRenderKey,
  dependentElements,
}: {
  elementInstance: QuestionnaireElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: QuestionnaireError[];
  defaultValue?: string;
  formValues?: { [key: string]: string };
  disabled?: boolean;
  generateRenderKey?: RenderFunction;
  dependentElements?: string[];
}) => {
  const [value, setValue] = useState<string[]>(
    defaultValue ? JSON.parse(defaultValue) : [],
  );
  const [errors, setErrors] = useState<QuestionnaireError[]>([]);
  const [visible, setVisible] = useState(true);

  const element = elementInstance as CustomInstance;
  const { label, helperText, placeHolder, options, required, conditions } =
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
      <MultiSelect
        modalPopover={submitValue ? false : true}
        isdisabled={disabled}
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        value={value}
        defaultValue={value}
        onValueChange={(values) => {
          setValue(values);
          if (!submitValue) return;
          const errors = CheckboxFieldQuestionnaireElement.validate(
            element,
            values.join(","),
          );
          setErrors(errors);
          submitValue(element.id, JSON.stringify(values));
          dependentElements?.forEach((element) => generateRenderKey?.(element));
        }}
        error={errors.length > 0 ? true : undefined}
        placeholder={placeHolder}
        variant="tenantPrimary"
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
      options: element.extraAttributes.options,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { label, helperText, required, options, conditions } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
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

export const CheckboxFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "ListTodo",
    label: "Múltipla escolha",
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
