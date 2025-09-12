import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { LucideIcon } from "lucide-react";

type CustomInputWithIconProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  conteinerClassName?: string;
  required?: boolean;
  icon: LucideIcon;
} & InputHTMLAttributes<HTMLInputElement>;

export function CustomInputWithIcon<T extends FieldValues>({
  name,
  label,
  description,
  required,
  conteinerClassName,
  icon: Icon,
  ...inputProps
}: CustomInputWithIconProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={conteinerClassName}>
          {label && (
            <FormLabel>
              {label}
              {required && " *"}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                {...field}
                {...inputProps}
                value={field.value ?? ""}
                className="pl-10"
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
