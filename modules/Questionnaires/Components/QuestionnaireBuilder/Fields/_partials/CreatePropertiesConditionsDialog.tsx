"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  InputElements,
  QuestionnaireElements,
} from "../../../Constants/QuestionnaireElements";

const CreatePropertiesConditionsDialog = ({
  isOpen,
  setIsOpen,
  elementId,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  elementId: string;
}) => {
  const { elements } = useDesigner();
  const [isLoading, setIsLoading] = useState(false);
  const conditionsForm = useFormContext<{
    conditions: Condition[];
  }>();
  const { append } = useFieldArray({
    name: "conditions",
    control: conditionsForm.control,
  });
  const form = useForm<z.infer<typeof conditionSchema>>({
    resolver: zodResolver(conditionSchema),
    defaultValues: {
      field: "",
      operator: "",
      value: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof conditionSchema>) => {
    setIsLoading(true);
    try {
      const data = {
        ...values,
        value: values.value.toString(),
      };
      append(data);
      form.reset();
      setIsOpen(false);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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
        submitValue={(key, value) => form.setValue("value", value)}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Condição</DialogTitle>
          <DialogDescription>
            Adicione uma condição para a renderização do elemento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      options={elements
                        .filter(
                          (element) =>
                            InputElements.includes(element.type) &&
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
                      options={ConditionTypes.filter((type) => {
                        if (type.value == "range") return false;
                        if (
                          elements.find(
                            (element) => element.id == form.watch("field"),
                          )?.type != "NumberField"
                        ) {
                          return (
                            type.value == "equal_to" ||
                            type.value == "not_equal_to"
                          );
                        }
                        return true;
                      })}
                      selected={field.value ?? ""}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderComponent()}
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            variant="tenantPrimary"
          >
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertiesConditionsDialog;
