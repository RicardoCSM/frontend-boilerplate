"use client";

import { Label } from "@/components/ui/label";
import {
  ElementsType,
  QuestionnaireElement,
  QuestionnaireElementInstance,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { Separator } from "@/components/ui/separator";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "TitleField";

const extraAttributes: {
  title: string;
  conditions: Condition[];
} = {
  title: "Título",
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
      <Label className="text-muted-foreground">Título</Label>
      <p className="text-xl">{title}</p>
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

  return <p className="text-xl">{title}</p>;
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
      description: "Título atualizado com sucesso",
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
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
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

export const TitleFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "Heading1",
    label: "Título",
  },
  designerComponent: DesignerComponent,
  questionnaireComponent: QuestionnaireComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => [],
};
