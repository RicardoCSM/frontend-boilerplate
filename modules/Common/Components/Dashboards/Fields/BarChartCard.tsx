"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DashboardElement,
  DashboardElementInstance,
  ElementsType,
} from "../../Constants/DashboardElements";
import Icon from "../../RootLayout/_partials/Icon";
import { icons } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const type: ElementsType = "BarChartCard";

const extraAttributes: {
  title: string;
  timePeriod: string;
  icon: keyof typeof icons | null;
  description?: string;
  extraDescription?: string;
  config: ChartConfig;
  data: {
    [key: string]: string | number;
  }[];
  dataKey?: string;
  axisDataKey?: string;
} = {
  title: "Título",
  timePeriod: "Janeiro - Junho 2025",
  icon: null,
  description: "Descrição",
  extraDescription: "Descrição extra",
  config: {},
  data: [],
  dataKey: "dataKey",
  axisDataKey: "axisDataKey",
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
  const {
    title,
    timePeriod,
    icon,
    description,
    extraDescription,
    config,
    data,
    dataKey,
    axisDataKey,
  } = element.extraAttributes;

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{timePeriod}</CardDescription>
        </div>
        {icon && <Icon name={icon} className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={axisDataKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey={dataKey ?? ""}
              fill={`var(--color-${dataKey})`}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {(description || extraDescription) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {description}
          </div>
          <div className="leading-none text-muted-foreground">
            {extraDescription}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export const BarChartCardDashboardElement: DashboardElement = {
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
