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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { Separator } from "@/components/ui/separator";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import debounce from "lodash.debounce";
import { withMask } from "use-mask-input";
const type: ElementsType = "TextField";

const extraAttributes: {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  mask?: string;
  conditions: Condition[];
} = {
  label: "Texto curto",
  helperText: "Texto de ajuda",
  required: false,
  placeHolder: "Valor aqui...",
  mask: undefined,
  conditions: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2, { message: "Campo obrigatório!" }),
  helperText: z.string(),
  required: z.boolean().default(false),
  placeHolder: z
    .string()
    .max(50, { message: "O texto interior deve ter no máximo 50 caractéres!" }),
  mask: z.string().optional(),
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
      <Label className="truncate">
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeHolder} />
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
  const { setValue, watch } = useForm({
    defaultValues: {
      value: defaultValue || "",
    },
  });
  const value = watch("value");
  const [errors, setErrors] = useState<QuestionnaireError[]>([]);
  const [visible, setVisible] = useState(true);
  const isFirstRender = useRef(true);

  const element = elementInstance as CustomInstance;
  const { label, helperText, required, placeHolder, mask, conditions } =
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

  const updateValue = useCallback(
    (newValue: string) => {
      if (!submitValue) return;
      const errors = TextFieldQuestionnaireElement.validate(element, newValue);
      setErrors(errors);
      submitValue(element.id, newValue);
    },
    [submitValue, element],
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce((newValue: string) => {
        updateValue(newValue);
        dependentElements?.forEach((element) => generateRenderKey?.(element));
      }, 1000),
    [updateValue, generateRenderKey, dependentElements],
  );

  const newRender = useCallback(
    (newValue: string) => {
      debouncedUpdate(newValue);
    },
    [debouncedUpdate],
  );

  useEffect(() => {
    if (!isFirstRender.current) {
      newRender(value);
    }

    isFirstRender.current = false;
  }, [value, updateValue, newRender]);

  if (!visible) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input
        placeholder={placeHolder}
        disabled={disabled}
        ref={mask ? withMask(mask, { autoUnmask: true }) : undefined}
        value={value}
        onChange={(e) => setValue("value", e.target.value)}
        onBlur={() => {
          updateValue(value);
        }}
        error={errors.length > 0 ? true : undefined}
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
      mask: element.extraAttributes.mask,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { label, helperText, required, placeHolder, mask, conditions } =
      values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeHolder,
        mask,
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Campo de texto curto atualizado com sucesso",
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
        <FormField
          control={form.control}
          name="mask"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Máscara</FormLabel>
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
                Máscara que será aplicada ao campo, ex: cpf
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

export const TextFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "Type",
    label: "Texto curto",
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
    } else if (currentValue.length > 255) {
      errors.push({
        type: "invalid",
        message: "O texto inserido é muito grande!",
      });
    }

    return errors;
  },
};
