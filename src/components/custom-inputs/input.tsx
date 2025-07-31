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

type CustomInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  conteinerClassName?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function CustomInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  conteinerClassName,
  ...inputProps
}: CustomInputProps<T>) {
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
            <Input {...field} {...inputProps} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
