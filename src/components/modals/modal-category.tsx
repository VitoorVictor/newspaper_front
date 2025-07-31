import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCategoryById,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/tanstackQuery/useCategory";
import { useEffect } from "react";
import { CustomInput } from "../custom-inputs/input";

const categorySchema = z.object({
  name: z
    .string({ message: "Obrigatório" })
    .min(5, "O nome deve ter pelo menos 3 caracteres")
    .max(200, "O nome deve ter no máximo 255 caracteres"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ModalCategoryProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  id?: number;
}
export const ModalCategory = ({
  onOpenChange,
  title,
  id,
}: ModalCategoryProps) => {
  const isUpdate = Boolean(id);
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, handleSubmit } = form;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(id!);
  const { data: categories, isLoading } = useCategoryById(id);

  useEffect(() => {
    if (isUpdate && categories) {
      console.log(categories.data);
      reset(categories.data);
    }
  }, [categories, isUpdate, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const res = isUpdate
      ? await updateCategory.mutateAsync(data)
      : await createCategory.mutateAsync(data);
    if (res) {
      reset();
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Preencha os dados da editoria</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col space-y-6"
          >
            {/* nome */}
            <CustomInput
              name="name"
              label="Nome"
              placeholder="Digite o nome da editoria"
              required
            />

            {/* Botões fixos na parte inferior */}
            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isUpdate ? "Atualizar" : "Criar"} Editoria
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
