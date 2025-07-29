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

interface ICustomMultiSelect {
  data: { id: number | string; name: string; [key: string]: any }[];
  type?: number | string;
  name: string;
  fieldValue: string;
  fieldLabel: string;
}
export const CustomMultiSelect = ({
  data,
  type,
  name,
  fieldValue,
  fieldLabel,
}: ICustomMultiSelect) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Tópicos *</FormLabel>
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
                        field.value.includes(d[fieldValue as keyof typeof d])
                      )
                      .map((d) => d[fieldLabel as keyof typeof d])
                      .join(", ")
                  : "Selecione os tópicos"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandGroup>
                  {data.map((d) => {
                    const isSelected = field.value?.includes(d[fieldValue]);
                    return (
                      <CommandItem
                        key={d[fieldValue]}
                        onSelect={() => {
                          const newValue = isSelected
                            ? field.value.filter(
                                (id: number) => id !== d[fieldValue]
                              )
                            : [...(field.value || []), d[fieldValue]];
                          field.onChange(newValue);
                        }}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        {d[fieldLabel]}
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
};
