"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import ContactTypes from "../Constants/ContactTypes";
import { withMask } from "use-mask-input";
import { ContactSchema } from "../../Lib/Validations/contactSchema";

interface ContactsTableProps {
  mode: "create" | "edit" | "view";
  modal?: boolean;
  disabled?: boolean;
}

interface ContactsFormValues {
  contacts: ContactSchema[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  mode,
  modal = false,
  disabled,
}) => {
  const form = useFormContext<ContactsFormValues>();
  const { fields, append, remove } = useFieldArray({
    name: "contacts",
    control: form.control,
  });

  return (
    <div className="border rounded-md p-2">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead></TableHead>
            <TableHead>Valor</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            {mode !== "view" && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.map((field, index) => (
            <React.Fragment key={field.id}>
              <TableRow>
                <TableCell colSpan={2} className="align-top">
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="py-1">
                        <FormControl>
                          <Combobox
                            modal={modal}
                            error={
                              !!form.formState.errors.contacts?.[index]?.type
                            }
                            options={ContactTypes}
                            selected={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              form.setValue(`contacts.${index}.value`, "");
                            }}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell colSpan={3} className="align-top">
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="py-1">
                        <FormControl>
                          <Input
                            {...field}
                            error={
                              !!form.formState.errors.contacts?.[index]?.value
                            }
                            key={form.watch(`contacts.${index}.type`)}
                            disabled={disabled}
                            ref={
                              ContactTypes.find(
                                (type) =>
                                  type.value ===
                                  form.watch(`contacts.${index}.type`),
                              )?.mask
                                ? withMask(
                                    ContactTypes.find(
                                      (type) =>
                                        type.value ===
                                        form.watch(`contacts.${index}.type`),
                                    )?.mask ?? "",
                                    { autoUnmask: true },
                                  )
                                : undefined
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                {mode !== "view" && (
                  <TableCell className="align-top">
                    <div className="flex items-center justify-center gap-6 pt-3">
                      {mode == "edit" ? (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Trash className="cursor-pointer h-6 w-6 text-destructive" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja remover?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não poderá ser desfeita. O contato
                                será removido permanentemente e seu histórico
                                será mantido.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className={cn(
                                  buttonVariants({ variant: "destructive" }),
                                )}
                                onClick={() => remove(index)}
                              >
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Trash
                          className="cursor-pointer h-6 w-6 text-destructive"
                          onClick={() => remove(index)}
                        />
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {mode !== "view" && (
        <Button
          type="button"
          variant="tenantPrimary"
          onClick={() =>
            append({
              type: "",
              value: "",
            })
          }
          className="ml-2 mt-2"
          size="sm"
        >
          Adicionar
        </Button>
      )}
    </div>
  );
};

export default ContactsTable;
