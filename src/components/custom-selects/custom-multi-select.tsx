import { Check } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

type OptionType = {
  id: number | string;
  name: string;
  [key: string]: any;
};

interface CustomMultiSelectProps<T extends OptionType> {
  data: T[];
  type?: "string" | "number";
  name: string;
  fieldValue: keyof T;
  fieldLabel: keyof T;
  label?: string;
  placeholder?: string;
}

export function CustomMultiSelect<T extends OptionType>({
  data,
  type = "number",
  name,
  fieldValue,
  fieldLabel,
  label = "Selecione",
  placeholder = "Selecione os tópicos",
}: CustomMultiSelectProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label} *</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value?.length && "text-muted-foreground"
                )}
              >
                {field.value?.length
                  ? data
                      .filter((d) =>
                        field.value.includes(
                          type === "string"
                            ? String(d[fieldValue])
                            : Number(d[fieldValue])
                        )
                      )
                      .map((d) => d[fieldLabel])
                      .join(", ")
                  : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandGroup>
                  {data.map((item) => {
                    const itemValue =
                      type === "string"
                        ? String(item[fieldValue])
                        : Number(item[fieldValue]);

                    const isSelected = field.value?.includes(itemValue);

                    return (
                      <CommandItem
                        key={itemValue}
                        onSelect={() => {
                          let newValue;
                          if (isSelected) {
                            newValue = field.value.filter(
                              (val: any) => val !== itemValue
                            );
                          } else {
                            newValue = [...(field.value || []), itemValue];
                          }
                          field.onChange(newValue);
                        }}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        {item[fieldLabel]}
                        <Checkbox checked={isSelected} />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
