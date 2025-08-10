import { Input } from "@/components/ui/input";
import { InputHTMLAttributes, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputProps.type === "password";
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
              <Input
                {...field}
                {...inputProps}
                type={isPassword && showPassword ? "text" : inputProps.type}
                value={field.value ?? ""}
                className={isPassword ? "pr-10" : undefined} // espaço pro ícone
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
