"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionnaireDetailsVersionDropdownProps {
  questionnaireId: string;
  version: number;
  max_version: number;
}

const QuestionnaireDetailsVersionDropdown: React.FC<
  QuestionnaireDetailsVersionDropdownProps
> = ({ questionnaireId, version, max_version }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="tenantOutline">
          {version}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuLabel>Versões</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={version.toString()}
          onValueChange={(value) => {
            if (value !== version.toString()) {
              window.location.href = `/admin/questionnaires/${questionnaireId}?version=${value}`;
            }
          }}
        >
          {Array.from({ length: max_version }, (_, i) => (
            <DropdownMenuRadioItem key={i} value={(max_version - i).toString()}>
              {max_version - i}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuestionnaireDetailsVersionDropdown;
