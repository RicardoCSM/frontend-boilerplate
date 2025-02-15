"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { withMask } from "use-mask-input";
import { AddressSchema } from "../../Lib/Validations/addressSchema";

interface AddressFormProps {
  disabled: boolean;
}

interface AddressFormValues {
  address: AddressSchema;
}

const AddressForm: React.FC<AddressFormProps> = ({ disabled }) => {
  const form = useFormContext<AddressFormValues>();
  const formRef = useRef(form);
  const watchPostalCode = form.watch("address.postal_code");

  const fetchAddress = useCallback(() => {
    axios
        .get(`https://viacep.com.br/ws/${watchPostalCode}/json/`)
        .then(({ data }) => {
          if (!data.erro) {
            formRef.current.setValue("address.neighborhood", data.bairro);
            formRef.current.setValue("address.street", data.logradouro);
            formRef.current.setValue("address.city", data.localidade);
            formRef.current.setValue("address.state", data.uf);
            formRef.current.clearErrors("address.postal_code");
          } else {
            formRef.current.setValue("address.neighborhood", "");
            formRef.current.setValue("address.street", "");
            formRef.current.setValue("address.city", "");
            formRef.current.setValue("address.state", "");
            formRef.current.setError("address.postal_code", {
              type: "manual",
              message: "CEP inválido",
            });
          }
        })
        .catch(() => {
          formRef.current.setValue("address.neighborhood", "");
          formRef.current.setValue("address.street", "");
          formRef.current.setValue("address.city", "");
          formRef.current.setValue("address.state", "");
          formRef.current.setError("address.postal_code", {
            type: "manual",
            message: "CEP inválido",
          });
        });
  }, [watchPostalCode]);

  useEffect(() => {
    if (watchPostalCode?.length === 8) {
      fetchAddress();
    }
  }, [watchPostalCode, fetchAddress]);

  return (
    <>
      <div className="grid md:grid-cols-5 gap-6">
        <FormField
          control={form.control}
          name="address.postal_code"
          render={({ field }) => (
            <FormItem className="col-span-3 md:col-span-1">
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.postal_code}
                  disabled={disabled}
                  {...field}
                  ref={withMask("99999-999", { autoUnmask: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.street}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.number"
          render={({ field }) => (
            <FormItem className="col-span-3 md:col-span-1">
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.number}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem className="col-span-3 md:col-span-1">
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.state}
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.city}
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.neighborhood"
          render={({ field }) => (
            <FormItem className="col-span-3 md:col-span-1">
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  error={form.formState.errors?.address?.neighborhood}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AddressForm;
