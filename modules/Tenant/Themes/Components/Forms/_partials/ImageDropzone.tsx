"use client";

import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ThemeSchema } from "../../../Lib/Validations/themes";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageDropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  field: keyof ThemeSchema;
  defaultPreview?: string;
  dropMessage: React.ReactNode;
  disabled?: boolean;
}

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  dropMessage,
  defaultPreview,
  disabled,
  field,
  ...props
}) => {
  const form = useFormContext<ThemeSchema>();
  const [preview, setPreview] = useState<string | null>(
    form.getValues(field)
      ? URL.createObjectURL(form.getValues(field) as File)
      : defaultPreview || null,
  );

  const handleOnDrop = (acceptedFiles: FileList | null) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const fileType = allowedTypes.find(
        (type) => type === acceptedFiles[0].type,
      );
      if (!fileType) {
        form.setError(field, {
          message: "Formato do arquivo não suportado",
          type: "typeError",
        });
      } else {
        form.setValue(field, acceptedFiles[0]);
        form.clearErrors(field);
      }

      const displayUrl = URL.createObjectURL(acceptedFiles[0]);
      setPreview(displayUrl);
    } else {
      form.setError(field, {
        message: "Necessário selecionar um arquivo",
        type: "typeError",
      });
    }
  };

  return (
    <>
      {preview ? (
        <div className="flex flex-col h-[174px] shadow-sm">
          <div className="flex w-full justify-end">
            {!disabled && (
              <X
                className="size-4 cursor-pointer"
                onClick={() => {
                  setPreview(null);
                  form.setValue(field, null);
                }}
              />
            )}
          </div>
          <div className="max-h-[158px]">
            <Image
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[158px]"
              width={0}
              height={0}
            />
          </div>
        </div>
      ) : (
        <Dropzone
          {...props}
          dropMessage={dropMessage}
          handleOnDrop={handleOnDrop}
          disabled={disabled}
          error={form.formState.errors[field]}
          classNameWrapper="h-[174px] shadow-sm"
        />
      )}
    </>
  );
};

export default ImageDropzone;
