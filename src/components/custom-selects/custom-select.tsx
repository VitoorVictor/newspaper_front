import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OptionType = {
  id: number | string;
  name: string;
  [key: string]: any;
};

interface CustomSelectProps<T extends OptionType> {
  data: T[];
  type?: "string" | "number";
  name: string;
  fieldValue: keyof T & (string | number);
  fieldLabel: keyof T & string;
  label?: string;
  placeholder?: string;
  containerClassName?: string;
  required?: boolean;
}

export function CustomSelect<T extends OptionType>({
  data,
  type = "number",
  name,
  fieldValue,
  fieldLabel,
  label = "Selecione",
  placeholder = "Selecione os tópicos",
  containerClassName,
  required,
}: CustomSelectProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          <FormLabel>
            {label}
            {required ? " *" : null}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              const parsed =
                type === "number" && value !== "" ? Number(value) : value;
              field.onChange(parsed);
            }}
            defaultValue={String(field.value)}
          >
            <FormControl>
              <SelectTrigger className="min-w-40 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem
                  key={item[fieldValue]}
                  value={String(item[fieldValue])}
                >
                  {item[fieldLabel]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
