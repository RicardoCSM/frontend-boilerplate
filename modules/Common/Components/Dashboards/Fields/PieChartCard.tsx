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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const type: ElementsType = "PieChartCard";

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
  nameKey?: string;
  showActive?: boolean;
  showLegend?: boolean;
  innerText?: string;
} = {
  title: "Título",
  timePeriod: "Janeiro - Junho 2025",
  icon: null,
  description: "Descrição",
  extraDescription: "Descrição extra",
  config: {},
  data: [],
  dataKey: "dataKey",
  nameKey: "nameKey",
  showActive: true,
  showLegend: false,
  innerText: "Texto interno",
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
    nameKey,
    showActive,
    showLegend,
    innerText,
  } = element.extraAttributes;
  const id = "pie-interactive";
  const [activeKey, setActiveKey] = useState(data[0][nameKey!]);

  const activeIndex = useMemo(
    () => data.findIndex((item) => item[nameKey!] === activeKey),
    [activeKey, data, nameKey],
  );
  const keys = useMemo(
    () => data.map((item) => item[nameKey!]),
    [data, nameKey],
  );

  return (
    <Card data-chart={id} className="flex flex-col justify-between h-full">
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{timePeriod}</CardDescription>
        </div>
        {icon && <Icon name={icon} className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <ChartContainer
          id={id}
          config={config}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey ?? ""}
              nameKey={nameKey}
              innerRadius={showActive ? 60 : 0}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector
                    {...props}
                    outerRadius={showActive ? outerRadius + 10 : outerRadius}
                  />
                  {showActive && (
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  )}
                </g>
              )}
            >
              {showActive && (
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {data[activeIndex][dataKey!].toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {innerText}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              )}
            </Pie>
            {!showActive && showLegend && (
              <ChartLegend
                content={<ChartLegendContent nameKey={dataKey} />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            )}
          </PieChart>
        </ChartContainer>
        {showActive && (
          <Select value={activeKey as string} onValueChange={setActiveKey}>
            <SelectTrigger
              className="ml-auto h-max w-full rounded-lg pl-2.5 whitespace-normal"
              aria-label={`Selecione um ${innerText}`}
            >
              <SelectValue placeholder={`Selecione um ${innerText}`} />
            </SelectTrigger>
            <SelectContent
              align="center"
              className="rounded-xl min-w-0 max-w-[90vw]"
            >
              {keys.map((key) => {
                const conf = config[key as keyof typeof config];

                if (!conf) {
                  return null;
                }

                return (
                  <SelectItem
                    key={key}
                    value={key as string}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {conf?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
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

export const PieChartCardDashboardElement: DashboardElement = {
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
