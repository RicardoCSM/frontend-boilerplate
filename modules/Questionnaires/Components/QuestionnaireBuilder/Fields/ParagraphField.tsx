"use client";

import { Label } from "@/components/ui/label";
import {
  ElementsType,
  QuestionnaireElement,
  QuestionnaireElementInstance,
} from "../../Constants/QuestionnaireElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { Separator } from "@/components/ui/separator";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "ParagraphField";

const extraAttributes: {
  title: string;
  conditions: Condition[];
} = {
  title: "Parágrafo",
  conditions: [],
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(255),
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
  const { title } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Parágrafo</Label>
      <p className="text-sm break-all">{title}</p>
    </div>
  );
};

const QuestionnaireComponent = ({
  elementInstance,
  formValues,
}: {
  elementInstance: QuestionnaireElementInstance;
  formValues?: { [key: string]: string };
}) => {
  const element = elementInstance as CustomInstance;
  const { title, conditions } = element.extraAttributes;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (conditions && conditions.length > 0 && formValues) {
      const shouldShow = conditions.every((condition) => {
        return verifyCondition(
          condition.operator,
          condition.value,
          formValues?.[condition.field] || "",
        );
      });
      setVisible(shouldShow);
    }
  }, [formValues, conditions]);

  if (!visible) return null;

  return <p className="text-sm break-all">{title}</p>;
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
      title: element.extraAttributes.title,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { title, conditions } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title,
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Parágrafo atualizado com sucesso",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parágrafo</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  error={form.formState.errors.title}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <PropertiesConditionsField elementId={element.id} />
        <Separator />
        <Button type="submit" variant="tenantPrimary">
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export const ParagraphFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "Pilcrow",
    label: "Parágrafo",
  },
  designerComponent: DesignerComponent,
  questionnaireComponent: QuestionnaireComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => [],
};
