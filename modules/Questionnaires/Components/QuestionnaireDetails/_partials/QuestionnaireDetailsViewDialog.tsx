"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import {
  QuestionnaireElementInstance,
  QuestionnaireElements,
} from "../../Constants/QuestionnaireElements";
import React from "react";
import { cn } from "@/lib/utils";

interface QuestionnaireDetailsViewDialogProps {
  elements: QuestionnaireElementInstance[];
}

const QuestionnaireDetailsViewDialog: React.FC<
  QuestionnaireDetailsViewDialogProps
> = ({ elements }) => {
  const renderElements = () => {
    const rows = elements.reduce((acc, curr) => {
      if (curr.row > acc) return curr.row;
      return acc;
    }, 0);

    const elementsByRow = Array.from({ length: rows }, (_, i) => {
      return elements
        .filter((element) => element.row === i + 1)
        .sort((a, b) => a.col - b.col);
    });

    return elementsByRow.map((row, i) => {
      return (
        <div
          key={i}
          className={cn("grid gap-2 auto-cols-max", "grid-cols-" + row.length)}
        >
          {row.map((element, index) => {
            const QuestionnaireComponent =
              QuestionnaireElements[element.type].questionnaireComponent;
            return (
              <QuestionnaireComponent key={index} elementInstance={element} />
            );
          })}
        </div>
      );
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tenantOutline">
          <Eye className="size-4 mr-2" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <DialogTitle className="text-lg font-bold text-muted-foreground">
            Visualização do questionário
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Visualize como o questionário está sendo exibido para os usuários
          </DialogDescription>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-[800px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-3xl p-8 overflow-y-auto">
            {renderElements()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireDetailsViewDialog;
