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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const type: ElementsType = "TableCard";

const extraAttributes: {
  title: string;
  icon: keyof typeof icons | null;
  description?: string;
  commentary?: string;
  extraCommentary?: string;
  columns: {
    label: string;
    value: string;
    type: "avatar" | "text";
  }[];
  values: {
    [key: string]: string;
  }[];
} = {
  title: "Title",
  icon: null,
  description: "Description",
  commentary: "Commentary",
  extraCommentary: "Extra Commentary",
  columns: [
    {
      label: "Column 1",
      value: "value1",
      type: "avatar",
    },
    {
      label: "Column 2",
      value: "value2",
      type: "text",
    },
    {
      label: "Column 3",
      value: "value3",
      type: "text",
    },
  ],
  values: [
    {
      value1: "Content 1",
      value2: "Value 1",
      value3: "Value 1",
    },
    {
      value1: "Content 2",
      value2: "Value 2",
      value3: "Value 2",
    },
    {
      value1: "Content 3",
      value2: "Value 3",
      value3: "Value 3",
    },
    {
      value1: "Content 4",
      value2: "Value 4",
      value3: "Value 4",
    },
    {
      value1: "Content 5",
      value2: "Value 5",
      value3: "Value 5",
    },
  ],
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
    icon,
    description,
    commentary,
    extraCommentary,
    columns,
    values,
  } = element.extraAttributes;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {icon && <Icon name={icon} className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.value}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((value, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.value}>
                    {column.type === "avatar" ? (
                      <Avatar>
                        <AvatarImage src={value[column.value]} />
                        <AvatarFallback>
                          {value[
                            columns.find((col) => col.type === "text")!
                              .value
                          ]
                            ? value[
                              columns.find((col) => col.type === "text")!
                                .value
                            ].charAt(0)
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      value[column.value]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {(commentary || extraCommentary) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {commentary}
          </div>
          <div className="leading-none text-muted-foreground">
            {extraCommentary}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export const TableCardDashboardElement: DashboardElement = {
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
