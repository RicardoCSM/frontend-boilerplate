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
import { SeparatorHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { Separator } from "@/components/ui/separator";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "SpacerField";

const extraAttributes: {
  height: number;
  conditions: Condition[];
} = {
  height: 20,
  conditions: [],
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
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
  const { height } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">Espaçamento: {height}px</Label>
      <SeparatorHorizontal className="size-8" />
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
  const { height, conditions } = element.extraAttributes;
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

  return <div style={{ height, width: "100%" }} />;
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
      height: element.extraAttributes.height,
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { height, conditions } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height,
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Espaçamento atualizado com sucesso",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Altura (px): {form.watch("height")}</FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
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

export const SpacerFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "SeparatorVertical",
    label: "Espaçamento",
  },
  designerComponent: DesignerComponent,
  questionnaireComponent: QuestionnaireComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => [],
};
