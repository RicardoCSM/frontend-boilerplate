"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Condition } from "@/modules/Common/Components/Constants/ConditionTypes";
import { PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import CreatePropertiesConditionsDialog from "./CreatePropertiesConditionsDialog";
import PropertiesConditionsActionsDialog from "./PropertiesConditionsActionsDialog";

interface PropertiesConditionsFieldProps {
  elementId: string;
}

export const PropertiesConditionsField: React.FC<
  PropertiesConditionsFieldProps
> = ({ elementId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useFormContext<{
    conditions: Condition[];
  }>();
  const { remove } = useFieldArray({
    name: "conditions",
    control: form.control,
  });

  return (
    <>
      <FormField
        control={form.control}
        name="conditions"
        render={() => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Condições</FormLabel>
              <Button
                variant="outline"
                className="gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}
              >
                <PlusCircle className="size-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {form.watch("conditions").map((condition, index) => (
                <div
                  key={index}
                  className="flex text-sm justify-between items-center gap-1"
                >
                  Condição {index + 1}
                  <div className="flex gap-1">
                    <PropertiesConditionsActionsDialog
                      condition={condition}
                      index={index}
                      elementId={elementId}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <XCircle className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />
      <CreatePropertiesConditionsDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        elementId={elementId}
      />
    </>
  );
};
