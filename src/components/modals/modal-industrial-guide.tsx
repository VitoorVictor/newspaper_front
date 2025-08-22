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
  useIndustrialGuideBySlug,
  useUpdateIndustrialGuide,
} from "@/hooks/tanstackQuery/useIndustrialGuide";
import { FileUpload } from "../file-upload";
import { useEffect, useState } from "react";
import { CustomMultiSelect } from "../custom-selects/custom-multi-select";
import { CustomInput } from "../custom-inputs/input";
import { ISector } from "@/interfaces/sector";
import { PhoneInput } from "../custom-inputs/phone-input";
import { CustomFooterDialog } from "../custom-footer-dialog";

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
      .max(15, "O número deve ter no máximo 15 caracteres")
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
  slug?: string;
  view?: boolean;
}

export const ModalIndustrialGuide = ({
  onOpenChange,
  title,
  sectors,
  id,
  slug,
  view = false,
}: ModalIndustrialGuideProps) => {
  const isUpdate = Boolean(id);
  const industrialGuideSchema = getIndustrialGuideSchema(isUpdate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<IndustrialGuideFormData>({
    resolver: zodResolver(industrialGuideSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createIndustrialGuide = useCreateIndustrialGuide();
  const updateIndustrialGuide = useUpdateIndustrialGuide(id!);
  const { data: industrialGuide, isLoading } = useIndustrialGuideBySlug(slug);

  useEffect(() => {
    if (isUpdate && industrialGuide) {
      setValue("name", industrialGuide.data.name);
      setValue("description", industrialGuide.data.description);
      setValue("address", industrialGuide.data.address);
      setValue("number", industrialGuide.data.number);
      setValue(
        "sector_ids",
        industrialGuide.data.sectors.map((sector) => sector.id)
      );
      setValue("created_at", new Date(industrialGuide.data.created_at).toISOString().slice(0, 16));
      setValue("updated_at", new Date(industrialGuide.data.updated_at).toISOString().slice(0, 16));
      setValue("image_url", industrialGuide.data.image_url);
    }
  }, [industrialGuide, isUpdate, reset]);

  const onSubmit = async (data: IndustrialGuideFormData) => {
    if (view) return; // Não permite submissão em modo visualização

    setIsSubmitting(true);
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
    setIsSubmitting(false);
  };

  if (isLoading) return null;

  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="md:max-w-4xl w-full aspace-y-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {view
              ? "Visualizando dados da indústria"
              : "Preencha os dados da indústria"}
          </DialogDescription>
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
                    label="Indústria criada em:"
                    type="datetime-local"
                    disabled
                  />
                  {/* Update */}
                  <CustomInput
                    name="updated_at"
                    label="Última alteração em:"
                    type="datetime-local"
                    disabled
                  />
                </div>
              )}

              {/* Nome */}
              <CustomInput
                name="name"
                label="Nome da Indústria"
                placeholder="Digite o nome da indústria"
                description="O nome da indústria (5-200 caracteres)"
                required
                disabled={view}
              />

              {/* Descrição */}
              <CustomInput
                name="description"
                label="Descrição"
                placeholder="Digite a descrição da indústria"
                description="Um resumo ou complemento referente à indústria (Opcional)"
                disabled={view}
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
                          {industrialGuide?.data.image_url ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${industrialGuide.data.image_url}`}
                              alt="Imagem da indústria"
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
                                  `${process.env.NEXT_PUBLIC_IMAGE_URL}${industrialGuide?.data.image_url}`,
                                ]
                              : []
                          }
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      {view
                        ? "Imagem da indústria"
                        : "Escolha uma imagem para a indústria"}
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
                  disabled={view}
                />

                {/* número */}
                <PhoneInput
                  name="number"
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  conteinerClassName="col-span-2"
                  disabled={view}
                />
              </div>

              {/* Setores */}
              <FormField
                control={control}
                name="sector_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setores *</FormLabel>
                    <FormControl>
                      {view ? (
                        <div className="p-3 border rounded-md bg-gray-50">
                          {field.value?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((id) => {
                                const sector = sectors.find(
                                  (sect) => sect.id === id
                                );
                                return (
                                  <span
                                    key={id}
                                    className="px-2 py-1 bg-primary text-white text-sm rounded-md"
                                  >
                                    {sector?.name || `ID: ${id}`}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500">
                              Nenhum setor selecionado
                            </span>
                          )}
                        </div>
                      ) : (
                        <CustomMultiSelect
                          name="sector_ids"
                          data={sectors}
                          fieldValue="id"
                          fieldLabel="name"
                          containerClassName="w-full"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botões fixos na parte inferior */}
            {!view ? (
              <CustomFooterDialog
                onOpenChange={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
                isUpdate={isUpdate}
                label="Indústria"
              />
            ) : (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Fechar
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
