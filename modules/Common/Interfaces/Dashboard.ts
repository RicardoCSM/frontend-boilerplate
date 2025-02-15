import { DateRange } from "./DateRange";
import { AdvancedFilter, Filter } from "./Filter";

export interface TabComponentProps {
  loading: {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
  };
  dateRange: DateRange | undefined;
  filters: Filter[];
}

export interface DashboardTab {
  value: string;
  label: string;
  title: string;
  filterTypes?: AdvancedFilter<never>[];
  component: React.FC<TabComponentProps>;
}

export interface Dashboard {
  start_date?: string;
  end_date?: string;
}
