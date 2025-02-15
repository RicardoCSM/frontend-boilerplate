import { useReducer, useEffect } from "react";
import { Input, InputProps } from "../ui/input";

export type InputCurrencyProps = InputProps & {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
};

const toCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const fromCurrency = (value: string) => {
  const numericValue = Number(value.replace(/\D/g, "")) / 100;
  return numericValue || 0;
};

export function InputCurrency({
  value = 0,
  onChange,
  label,
  ...props
}: InputCurrencyProps) {
  const [formattedValue, setFormattedValue] = useReducer(
    (_: string, next: string) => {
      if (!next) return "";
      const numericValue = fromCurrency(next);
      return numericValue ? toCurrency(numericValue) : "";
    },
    toCurrency(value),
  );

  useEffect(() => {
    setFormattedValue(toCurrency(value));
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = fromCurrency(inputValue);
    setFormattedValue(inputValue);
    if (onChange) onChange(numericValue);
  };

  return (
    <div>
      {label && <label htmlFor={props.id}>{label}</label>}
      <Input
        type="text"
        {...props}
        onChange={handleInputChange}
        value={formattedValue}
      />
    </div>
  );
}

export default InputCurrency;
