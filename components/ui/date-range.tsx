/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { withMask } from "use-mask-input";
import { DateRange as ReactDayPicker } from "react-day-picker";
import { DateRange } from "@/modules/Common/Interfaces/DateRange";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultDate?: ReactDayPicker;
  setDateRange: (date: DateRange | undefined) => void;
  modal?: boolean;
  disabled?: boolean;
  input?: boolean;
  isDatePickerOpen?: boolean;
  setIsDatePickerOpen?: Dispatch<SetStateAction<boolean>>;
  error?: any;
  fromYear?: number;
  toYear?: number;
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  defaultDate,
  setDateRange,
  className,
  input = true,
  modal = false,
  disabled = false,
  error = false,
  isDatePickerOpen,
  setIsDatePickerOpen,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 1,
}) => {
  const [date, setDate] = useState<ReactDayPicker | undefined>(
    defaultDate ?? {
      from: undefined,
      to: undefined,
    },
  );
  const [stringDate, setStringDate] = useState<string>(
    date && date.from && date.to
      ? `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
      : "",
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isDatePickerOpen) {
      if (date?.from && date?.to) {
        setDateRange({
          start_date: format(date.from, "yyyy-MM-dd"),
          end_date: format(date.to, "yyyy-MM-dd"),
        });
      } else {
        setDateRange(undefined);
      }
    }
  }, [date?.from, date?.to, isDatePickerOpen, setDateRange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        modal={modal}
        open={isDatePickerOpen ?? open}
        onOpenChange={setIsDatePickerOpen ?? setOpen}
      >
        <div className="relative w-full min-w-[280px]">
          <Input
            type="string"
            value={stringDate}
            ref={withMask("99/99/9999 - 99/99/9999")}
            error={error}
            disabled={input ? disabled : true}
            onChange={(e) => {
              setStringDate(e.target.value);
              const [from, to] = e.target.value.split(" - ");
              if (from && to) {
                const [dayFrom, monthFrom, yearFrom] = e.target.value
                  .split("/")
                  .map(Number);
                const [dayTo, monthTo, yearTo] = to.split("/").map(Number);
                const parsedDate = {
                  from: new Date(dayFrom, monthFrom - 1, yearFrom),
                  to: new Date(dayTo, monthTo - 1, yearTo),
                };
                if (
                  parsedDate.from.toString() === "Invalid Date" ||
                  parsedDate.to.toString() === "Invalid Date"
                ) {
                  setDate(undefined);
                } else {
                  setDate(parsedDate);
                }
              }
            }}
          />
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              disabled={disabled}
              className={cn(
                "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
                !date && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
              )}
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            captionLayout="dropdown-buttons"
            mode="range"
            defaultMonth={date?.to}
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setStringDate(
                (selectedDate?.from &&
                  `${format(selectedDate.from, "dd/MM/yyyy")}`) +
                  (selectedDate?.to
                    ? ` - ${format(selectedDate.to, "dd/MM/yyyy")}`
                    : ""),
              );
            }}
            numberOfMonths={2}
            fromYear={fromYear}
            toYear={toYear}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
