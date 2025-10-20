import { Button } from "@/components/ui/button";
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
  useCreateIndustrialGuide,
  useIndustrialGuideBySlug,
  useUpdateIndustrialGuide,
} from "@/hooks/tanstackQuery/useIndustrialGuide";
import { ISector } from "@/interfaces/sector";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CustomFooterDialog } from "../custom-footer-dialog";
import { CustomInput } from "../custom-inputs/input";
import { CustomInputWithIcon } from "../custom-inputs/input-with-icon";
import { PhoneInput } from "../custom-inputs/phone-input";
import { PhoneInputWithIcon } from "../custom-inputs/phone-input-with-icon";
import { CustomTextarea } from "../custom-inputs/textarea";
import { CustomMultiSelect } from "../custom-selects/custom-multi-select";
import { FileUpload } from "../file-upload";

const getIndustrialGuideSchema = (isUpdate: boolean) =>
  z.object({
    name: z
      .string({ message: "Obrigatório" })
      .min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z
      .string()
      .min(5, "A descrição deve ter pelo menos 5 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    address: z
      .string()
      .min(3, "O endereço deve ter pelo menos 3 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    number: z
      .string({ message: "Obrigatório" })
      .min(1, "O número deve ter pelo menos 1 caractere")
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
    instagram_url: z
      .string()
      .url("URL do Instagram inválida")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    whatsapp: z
      .string()
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    linkedin_url: z
      .string()
      .url("URL do LinkedIn inválida")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    facebook_url: z
      .string()
      .url("URL do Facebook inválida")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    website_url: z
      .string()
      .url("URL do website inválida")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
    email: z
      .string()
      .email("Email inválido")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
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
      setValue("instagram_url", industrialGuide.data.instagram_url || "");
      setValue("whatsapp", industrialGuide.data.whatsapp || "");
      setValue("linkedin_url", industrialGuide.data.linkedin_url || "");
      setValue("facebook_url", industrialGuide.data.facebook_url || "");
      setValue("website_url", industrialGuide.data.website_url || "");
      setValue("email", industrialGuide.data.email || "");
      setValue(
        "created_at",
        new Date(industrialGuide.data.created_at).toISOString().slice(0, 16)
      );
      setValue(
        "updated_at",
        new Date(industrialGuide.data.updated_at).toISOString().slice(0, 16)
      );
    }
  }, [industrialGuide, isUpdate, reset]);

  const onSubmit = async (data: IndustrialGuideFormData) => {
    if (view) return; // Não permite submissão em modo visualização

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image_url" && value instanceof File) {
          formData.append("image_url", value);
        } else if (key === "sector_ids" && Array.isArray(value)) {
          value.forEach((id) => formData.append("sector_ids[]", String(id)));
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
        ? await updateIndustrialGuide.mutateAsync(formData)
        : await createIndustrialGuide.mutateAsync(formData);
      if (res) {
        reset();
        onOpenChange(false);
      }
    } catch (error) {
      // O erro já é tratado no hook (onError), não precisamos fazer nada aqui
      console.error("Erro ao submeter formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent
        className="md:max-w-4xl w-full aspace-y-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
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
              <CustomTextarea
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
                  label="Celular / Telefone"
                  placeholder="(00) 00000-0000"
                  conteinerClassName="col-span-2"
                  disabled={view}
                />
              </div>

              {/* Setores */}
              {view ? (
                <FormField
                  control={control}
                  name="sector_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setores *</FormLabel>
                      <FormControl>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <CustomMultiSelect
                  name="sector_ids"
                  data={sectors}
                  fieldValue="id"
                  label="Setores"
                  fieldLabel="name"
                  containerClassName="w-full"
                />
              )}

              {/* Redes Sociais e Website */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 mb-2 border-b">
                  Redes Sociais e Website
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInputWithIcon
                    name="instagram_url"
                    label="Instagram"
                    placeholder="https://instagram.com/empresa"
                    icon={Instagram}
                    disabled={view}
                    description="URL completa do perfil no Instagram (Opcional)"
                  />

                  <PhoneInputWithIcon
                    name="whatsapp"
                    label="WhatsApp"
                    placeholder="(00) 00000-0000"
                    icon={MessageCircle}
                    disabled={view}
                    description="Número de WhatsApp (Opcional)"
                  />

                  <CustomInputWithIcon
                    name="linkedin_url"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/empresa"
                    icon={Linkedin}
                    disabled={view}
                    description="URL da página da empresa no LinkedIn (Opcional)"
                  />

                  <CustomInputWithIcon
                    name="facebook_url"
                    label="Facebook"
                    placeholder="https://facebook.com/empresa"
                    icon={Facebook}
                    disabled={view}
                    description="URL da página no Facebook (Opcional)"
                  />

                  <CustomInputWithIcon
                    name="email"
                    label="Email"
                    placeholder="contato@empresa.com"
                    icon={Mail}
                    disabled={view}
                    description="Email de contato (Opcional)"
                  />

                  <CustomInputWithIcon
                    name="website_url"
                    label="Website"
                    placeholder="https://www.empresa.com.br"
                    icon={Globe}
                    disabled={view}
                    description="Site oficial da empresa (Opcional)"
                  />
                </div>
              </div>
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
