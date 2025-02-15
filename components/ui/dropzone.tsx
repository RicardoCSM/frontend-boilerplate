import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React, { ChangeEvent, useRef } from "react";
import { FieldError } from "react-hook-form";

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  dropMessage: React.ReactNode;
  error?: FieldError;
  displayError?: boolean;
  isdisabled?: boolean;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
  fileTypes?: string[];
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      classNameWrapper,
      dropMessage,
      handleOnDrop,
      fileTypes,
      error,
      displayError,
      isdisabled = false,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleOnDrop(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        handleOnDrop(files);
      }
    };

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
    return (
      <Card
        ref={ref}
        className={cn(
          `border-2 border-dashed bg-background hover:cursor-pointer hover:border-muted-foreground/50`,
          error && "border-destructive hover:border-destructive/80",
          isdisabled && "pointer-events-none opacity-50",
          classNameWrapper,
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center space-y-6 px-6 py-6 text-sm"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <Upload className="text-muted-foreground h-8 w-8" />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center">
              <span>{dropMessage}</span>
              <Input
                {...props}
                value={undefined}
                ref={inputRef}
                type="file"
                className={cn("hidden", className)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleOnDrop(e.target.files)
                }
              />
            </div>
            {displayError && error ? (
              <span className="text-destructive">{error.message}</span>
            ) : (
              <>
                {fileTypes && (
                  <span className="text-muted-foreground">
                    Tipos de arquivo suportados: {fileTypes.join(", ")}
                  </span>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

Dropzone.displayName = "Dropzone";
export default Dropzone;
