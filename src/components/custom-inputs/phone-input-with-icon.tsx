import React from "react";
import { IMaskInput } from "react-imask";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PhoneInputWithIconProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  conteinerClassName?: string;
  className?: string;
  icon: LucideIcon;
}

export const PhoneInputWithIcon = ({
  name,
  label,
  placeholder = "(00) 00000-0000",
  description,
  required = false,
  disabled = false,
  conteinerClassName = "",
  className,
  icon: Icon,
}: PhoneInputWithIconProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={conteinerClassName}>
          <FormLabel>
            {label}
            {required && " *"}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <IMaskInput
                mask="(00) 0 0000-0000"
                unmask={true}
                value={field.value || ""}
                onAccept={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                name={field.name}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent pl-10 pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  className
                )}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
