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
  useCreateIndustrialGuide,
  useIndustrialGuideById,
  useUpdateIndustrialGuide,
} from "@/hooks/tanstackQuery/useIndustrialGuide";
import { FileUpload } from "../file-upload";
import { useEffect } from "react";
import { CustomMultiSelect } from "../custom-selects/custom-multi-select";
import { CustomInput } from "../custom-inputs/input";
import { ISector } from "@/interfaces/sector";

const getIndustrialGuideSchema = (isUpdate: boolean) =>
  z.object({
    name: z
      .string({ message: "Obrigatório" })
      .min(5, "O título deve ter pelo menos 5 caracteres")
      .max(200, "O título deve ter no máximo 255 caracteres"),

    description: z
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres")
      .max(300, "A descrição deve ter no máximo 255 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),

    address: z
      .string()
      .min(5, "O endereço deve ter pelo menos 5 caracteres")
      .max(300, "O endereço deve ter no máximo 255 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),

    number: z
      .string({ message: "Obrigatório" })
      .min(1, "O número deve ter pelo menos 1 caractere")
      .max(10, "O número deve ter no máximo 10 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),

    image_url: isUpdate
      ? z
          .custom<File>(
            (file) => {
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

    sector_ids: z.array(z.number(), {
      message: "Selecione pelo menos um tópico",
    }),

    sectors: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
        })
      )
      .optional()
      .nullable(),

    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
  });

type IndustrialGuideFormData = z.infer<
  ReturnType<typeof getIndustrialGuideSchema>
>;

interface ModalIndustrialGuideProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  sectors: ISector[];
  id?: number;
}

export const ModalIndustrialGuide = ({
  onOpenChange,
  title,
  sectors,
  id,
}: ModalIndustrialGuideProps) => {
  const isUpdate = Boolean(id);
  const industrialGuideSchema = getIndustrialGuideSchema(isUpdate);
  const form = useForm<IndustrialGuideFormData>({
    resolver: zodResolver(industrialGuideSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createIndustrialGuide = useCreateIndustrialGuide();
  const updateIndustrialGuide = useUpdateIndustrialGuide(id!);
  const { data: news, isLoading } = useIndustrialGuideById(id);

  useEffect(() => {
    if (isUpdate && news) {
      setValue("name", news.data.name);
      setValue("description", news.data.description);
      setValue("address", news.data.address);
      setValue("number", news.data.number);
      setValue(
        "sector_ids",
        news.data.sectors.map((sector) => sector.id)
      );
      setValue("created_at", news.data.created_at);
      setValue("updated_at", news.data.updated_at);
      setValue("image_url", news.data.image_url);
    }
  }, [news, isUpdate, reset]);

  const onSubmit = async (data: IndustrialGuideFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url" && value instanceof File) {
        formData.append("image_url", value);
      } else if (key === "sector_ids" && Array.isArray(value)) {
        value.forEach((id) => formData.append("sector_ids[]", String(id)));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (isUpdate) {
      formData.append("_method", "put");
    }
    const res = isUpdate
      ? await updateIndustrialGuide.mutateAsync(formData)
      : await createIndustrialGuide.mutateAsync(formData);
    if (res) {
      reset();
      onOpenChange(false);
    }
  };

  if (isLoading) return null;

  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="md:max-w-4xl w-full aspace-y-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Preencha os dados da industria</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            {/* Área scrollável do formulário */}
            <div className="flex-1 max-h-[70vh] overflow-y-auto p-2 space-y-6">
              {isUpdate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create */}
                  <CustomInput
                    name="created_at"
                    label="Industria criada em:"
                    type="datetime"
                    disabled
                  />
                  {/* Update */}
                  <CustomInput
                    name="updated_at"
                    label="Última alteração em:"
                    type="datetime"
                    disabled
                  />
                </div>
              )}

              {/* Nome */}
              <CustomInput
                name="name"
                label="Nome da Industria"
                placeholder="Digite o nome da industria"
                description="O nome da industria (5-200 caracteres)"
                required
              />

              {/* Subtítulo */}
              <CustomInput
                name="description"
                label="Descrição"
                placeholder="Digite a descrição da industria"
                description=" Um resumo ou complemento referente a industria (Opcional)"
              />

              {/* URL da Imagem */}
              <FormField
                control={control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem *</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/*"
                        onFileSelect={(file) => {
                          field.onChange(file);
                        }}
                        placeholder="Arraste uma imagem ou clique para selecionar"
                        maxSize={5}
                        hasPreview={
                          isUpdate
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${news?.data.image_url}`
                            : ""
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Escolha uma imagem para a notícia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* endereço */}
                <CustomInput
                  name="address"
                  label="Endereço"
                  placeholder="Dica de formato: Rua Exemplo - Bairro Centro, São Paulo - SP, 01000-000"
                  conteinerClassName="col-span-4"
                />

                {/* número */}
                <CustomInput
                  type="number"
                  name="number"
                  label="Número"
                  placeholder="Número do endereço"
                  conteinerClassName="col-span-2"
                />
              </div>

              {/* Tópico */}
              <CustomMultiSelect
                name="sector_ids"
                data={sectors}
                fieldValue="id"
                fieldLabel="name"
                containerClassName="w-full"
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
                {isUpdate ? "Atualizar" : "Criar"} Notícia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
