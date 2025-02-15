import { BarChartCardDashboardElement } from "../Dashboards/Fields/BarChartCard";
import { HorizontalBarChartCardDashboardElement } from "../Dashboards/Fields/HorizontalBarChartCard";
import { NumberCardDashboardElement } from "../Dashboards/Fields/NumberCard";
import { PieChartCardDashboardElement } from "../Dashboards/Fields/PieChartCard";
import { TableCardDashboardElement } from "../Dashboards/Fields/TableCard";

export type ElementsType =
  | "NumberCard"
  | "TableCard"
  | "BarChartCard"
  | "PieChartCard"
  | "HorizontalBarChartCard";

export const DataElements: ElementsType[] = ["NumberCard", "TableCard"];

export const GraphicElements: ElementsType[] = [
  "BarChartCard",
  "PieChartCard",
  "HorizontalBarChartCard",
];

export type SubmitFunction = (key: string, value: string) => void;
export type RenderFunction = (key: string) => void;

export type DashboardElement = {
  type: ElementsType;
  construct: (id: string) => DashboardElementInstance;
  dashboardComponent: React.FC<{
    elementInstance: DashboardElementInstance;
  }>;
};

export type DashboardElementInstance = {
  type: ElementsType;
  extraAttributes?: Record<string, unknown>;
  row: number;
  col: number;
  row_span?: number;
  col_span?: number;
};

export type DashboardElementsType = {
  [key in ElementsType]: DashboardElement;
};

export const DashboardElements: DashboardElementsType = {
  NumberCard: NumberCardDashboardElement,
  BarChartCard: BarChartCardDashboardElement,
  TableCard: TableCardDashboardElement,
  PieChartCard: PieChartCardDashboardElement,
  HorizontalBarChartCard: HorizontalBarChartCardDashboardElement,
};
