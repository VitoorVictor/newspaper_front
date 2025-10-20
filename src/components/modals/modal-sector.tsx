import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateSector,
  useSectorById,
  useUpdateSector,
} from "@/hooks/tanstackQuery/useSector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CustomFooterDialog } from "../custom-footer-dialog";
import { CustomInput } from "../custom-inputs/input";
import { FileUpload } from "../file-upload";

const getSectorSchema = (isUpdate: boolean) =>
  z.object({
    name: z
      .string({ message: "Obrigatório" })
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(200, "O nome deve ter no máximo 255 caracteres"),
    image_url: isUpdate
      ? z
          .custom<File>(
            (file) => {
              // só valida se for um File, senão ignora
              if (file === undefined || file === null || file === "")
                return true;
              return file instanceof File && file.size > 0;
            },
            { message: "Imagem inválida" }
          )
          .optional()
          .nullable()
      : z.custom<File>((file) => file instanceof File && file.size > 0, {
          message: "Uma imagem válida é obrigatória",
        }),
  });

type SectorFormData = z.infer<ReturnType<typeof getSectorSchema>>;

interface ModalSectorProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  id?: number;
  view: boolean;
}
export const ModalSector = ({
  onOpenChange,
  title,
  id,
  view,
}: ModalSectorProps) => {
  const isUpdate = Boolean(id);
  const sectorSchema = getSectorSchema(isUpdate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
      image_url: undefined,
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createSector = useCreateSector();
  const updateSector = useUpdateSector(id!);
  const { data: sector } = useSectorById(id);

  useEffect(() => {
    if (isUpdate && sector) {
      setValue("name", sector.data.name);
    }
  }, [sector, isUpdate, reset]);

  const onSubmit = async (data: SectorFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image_url" && value instanceof File) {
          formData.append("image_url", value);
        } else if (key === "created_at" || key === "updated_at") {
          return;
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (isUpdate) {
        formData.append("_method", "put");
      }
      const res = isUpdate
        ? await updateSector.mutateAsync(formData)
        : await createSector.mutateAsync(formData);
      if (res) {
        reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    } finally {
      setIsSubmitting(false);
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
            className="h-full flex flex-col"
          >
            <div className="flex-1 max-h-[70vh] overflow-y-auto p-2 space-y-6">
              {/* nome */}
              <CustomInput
                name="name"
                label="Nome"
                placeholder="Digite o nome do setor"
                required
              />

              {/* URL da Imagem */}
              <FormField
                control={control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem *</FormLabel>
                    <FormControl>
                      {view ? (
                        <div className="p-4 border rounded-md bg-gray-50 flex justify-center items-center">
                          {sector?.data.image_url ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${sector.data.image_url}`}
                              alt="Imagem do setor"
                              className="max-w-full h-auto max-h-64 rounded-md"
                            />
                          ) : (
                            <span className="text-gray-500">
                              Nenhuma imagem selecionada
                            </span>
                          )}
                        </div>
                      ) : (
                        <FileUpload
                          accept="image/*"
                          onFileSelect={(file) => {
                            if (!view) field.onChange(file);
                          }}
                          placeholder="Arraste uma imagem ou clique para selecionar"
                          maxSize={5}
                          hasPreview={
                            isUpdate
                              ? [
                                  `${process.env.NEXT_PUBLIC_IMAGE_URL}${sector?.data.image_url}`,
                                ]
                              : []
                          }
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      {view
                        ? "Imagem do setor"
                        : "Escolha uma imagem para o setor"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botões fixos na parte inferior */}
            <CustomFooterDialog
              onOpenChange={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
              isUpdate={isUpdate}
              label="Setor"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
