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
import { Form } from "@/components/ui/form";
import {
  useSectorById,
  useCreateSector,
  useUpdateSector,
} from "@/hooks/tanstackQuery/useSector";
import { useEffect } from "react";
import { CustomInput } from "../custom-inputs/input";

const sectorSchema = z.object({
  name: z
    .string({ message: "Obrigatório" })
    .min(5, "O nome deve ter pelo menos 3 caracteres")
    .max(200, "O nome deve ter no máximo 255 caracteres"),
});

type SectorFormData = z.infer<typeof sectorSchema>;

interface ModalSectorProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  id?: number;
}
export const ModalSector = ({ onOpenChange, title, id }: ModalSectorProps) => {
  const isUpdate = Boolean(id);
  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, handleSubmit } = form;
  const createSector = useCreateSector();
  const updateSector = useUpdateSector(id!);
  const { data: sectors } = useSectorById(id);

  useEffect(() => {
    if (isUpdate && sectors) {
      reset(sectors.data);
    }
  }, [sectors, isUpdate, reset]);

  const onSubmit = async (data: SectorFormData) => {
    const res = isUpdate
      ? await updateSector.mutateAsync(data)
      : await createSector.mutateAsync(data);
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
          <DialogDescription>Preencha os dados do setor</DialogDescription>
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
              placeholder="Digite o nome do setor"
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
                {isUpdate ? "Atualizar" : "Criar"} Setor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
