import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "./form";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>> & {
    "aria-invalid"?: boolean;
  };
  className?: string;
}

export function DatePicker<TFieldValues extends FieldValues = FieldValues>({
  field,
  className,
}: DatePickerProps<TFieldValues>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"ghost"}
            className={cn(
              "justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
              className,
              field["aria-invalid"] && "border border-destructive",
            )}
          >
            <CalendarIcon />
            {field.value ? (
              format(field.value, "PPP", { locale: pl })
            ) : (
              <span>Wybierz datę</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-5000" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          locale={pl}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
