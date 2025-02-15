"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Condition,
  conditionSchema,
  ConditionTypes,
} from "@/modules/Common/Components/Constants/ConditionTypes";
import useDesigner from "@/modules/Questionnaires/Hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QuestionnaireElements } from "../../../Constants/QuestionnaireElements";

const PropertiesConditionsActionsDialog = ({
  condition,
  index,
  elementId,
}: {
  condition: Condition;
  index: number;
  elementId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { elements } = useDesigner();
  const form = useForm<z.infer<typeof conditionSchema>>({
    resolver: zodResolver(conditionSchema),
    defaultValues: {
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
    },
  });

  const renderComponent = () => {
    const element = elements.find(
      (element) => element.id === form.watch("field"),
    );

    if (!element) return null;

    const ElementComponent =
      QuestionnaireElements[element.type].questionnaireComponent;

    return (
      <ElementComponent
        key={element.id}
        elementInstance={element}
        defaultValue={form.watch("value")}
      />
    );
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        variant="ghost"
        size="icon"
      >
        <Eye className="size-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Condição {index + 1}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campo</FormLabel>
                    <FormControl>
                      <Combobox
                        modal
                        error={form.formState.errors.field}
                        disabled
                        options={elements
                          .filter(
                            (element) =>
                              element?.extraAttributes?.label !== undefined &&
                              element.id !== elementId,
                          )
                          .map((element) => ({
                            label:
                              (element?.extraAttributes?.label as string) || "",
                            value: element.id,
                          }))}
                        selected={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operador</FormLabel>
                    <FormControl>
                      <Combobox
                        modal
                        error={form.formState.errors.operator}
                        disabled
                        options={ConditionTypes.filter(
                          (type) => type.value !== "range",
                        )}
                        selected={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pointer-events-none opacity-70">
                {renderComponent()}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertiesConditionsActionsDialog;
