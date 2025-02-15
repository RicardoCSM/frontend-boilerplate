"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DashboardElement,
  DashboardElementInstance,
  ElementsType,
} from "../../Constants/DashboardElements";
import Icon from "../../RootLayout/_partials/Icon";
import { icons } from "lucide-react";

const type: ElementsType = "NumberCard";

const extraAttributes: {
  title: string;
  icon: keyof typeof icons | null;
  value: number;
  description?: string;
} = {
  title: "Título",
  icon: null,
  value: 0,
  description: "Descrição",
};

type CustomInstance = DashboardElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DashboardComponent = ({
  elementInstance,
}: {
  elementInstance: DashboardElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { title, icon, value, description } = element.extraAttributes;

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <Icon name={icon} className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const NumberCardDashboardElement: DashboardElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
    row: 0,
    col: 0,
  }),
  dashboardComponent: DashboardComponent,
};
