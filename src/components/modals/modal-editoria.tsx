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
import { useCreateCategory } from "@/hooks/tanstackQuery/useCategory";

interface ModalEditoriaProps {
  onOpenChange: (open: boolean) => void;
  title: string;
}

const editoriaSchema = z.object({
  name: z
    .string({ message: "Obrigatório" })
    .min(5, "O nome deve ter pelo menos 3 caracteres")
    .max(200, "O nome deve ter no máximo 255 caracteres"),
});

type EditoriaFormData = z.infer<typeof editoriaSchema>;

export const ModalEditoria = ({ onOpenChange, title }: ModalEditoriaProps) => {
  const form = useForm<EditoriaFormData>({
    resolver: zodResolver(editoriaSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, handleSubmit, control } = form;
  const createCategory = useCreateCategory();

  const onSubmit = async (data: EditoriaFormData) => {
    const res = await createCategory.mutateAsync(data);
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
            className="h-full flex flex-col"
          >
            {/* Área scrollável do formulário */}
            <div className="flex-1 max-h-[70vh] overflow-y-auto px-2 space-y-6">
              {/* nome */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome da editoria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botões fixos na parte inferior */}
            <DialogFooter className="flex-shrink-0 mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {false ? "Atualizar" : "Criar"} Editoria
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
