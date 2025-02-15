"use client";

import { Label } from "@/components/ui/label";
import {
  ElementsType,
  QuestionnaireElement,
  QuestionnaireElementInstance,
} from "../../Constants/QuestionnaireElements";
import { Separator } from "@/components/ui/separator";
import {
  Condition,
  conditionSchema,
  verifyCondition,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import { z } from "zod";
import { useEffect, useState } from "react";
import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { PropertiesConditionsField } from "./_partials/PropertiesConditionsField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "SeparatorField";

const extraAttributes: {
  conditions: Condition[];
} = {
  conditions: [],
};

const propertiesSchema = z.object({
  conditions: z.array(conditionSchema).default([]),
});

type CustomInstance = QuestionnaireElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DesignerComponent = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Separador</Label>
      <Separator />
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
  const { conditions } = element.extraAttributes;
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

  return <Separator />;
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
      conditions: element.extraAttributes.conditions,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
    const { conditions } = values;

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        conditions,
      },
    });
    toast({
      title: "Sucesso",
      description: "Separador atualizado com sucesso",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <PropertiesConditionsField elementId={element.id} />
        <Separator />
        <Button type="submit" variant="tenantPrimary">
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export const SeparatorFieldQuestionnaireElement: QuestionnaireElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  designerBtnElement: {
    icon: "SeparatorHorizontal",
    label: "Separador",
  },
  designerComponent: DesignerComponent,
  questionnaireComponent: QuestionnaireComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => [],
};
