import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

type CustomTextareaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  conteinerClassName?: string;
  required?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function CustomTextarea<T extends FieldValues>({
  name,
  label,
  description,
  required,
  conteinerClassName,
  ...textareaProps
}: CustomTextareaProps<T>) {
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
            <Textarea {...field} {...textareaProps} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
