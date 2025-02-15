interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface Filter {
  key: string;
  value: string;
}

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface FilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface AdvancedFilter<TData> extends FilterField<TData> {
  type: "select" | "text" | "number" | "boolean" | "date";
}
