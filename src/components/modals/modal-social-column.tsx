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
  useCreateSocialColumns,
  useDeleteImgSocialColumns,
  useSocialColumnsBySlug,
  useUpdateSocialColumns,
} from "@/hooks/tanstackQuery/useSocialColumns";
import { FileUpload } from "../file-upload";
import { useEffect, useState } from "react";
import { CustomInput } from "../custom-inputs/input";
import { CustomCarousel } from "../custom-carousel";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../confirm-dialog";
import { CustomFooterDialog } from "../custom-footer-dialog";

const getSocialColumnsSchema = (isUpdate: boolean) =>
  z.object({
    title: z
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
    main_image: isUpdate
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
    images: isUpdate
      ? z
          .array(
            z.custom<File>(
              (file) => {
                if (file === undefined || file === null || file === "")
                  return true;
                return file instanceof File && file.size > 0;
              },
              { message: "Imagem inválida" }
            )
          )
          .optional()
          .nullable()
      : z
          .array(
            z.custom<File>(
              (file) => {
                return file instanceof File && file.size > 0;
              },
              { message: "Imagem inválida" }
            )
          )
          .min(1, { message: "Uma imagem válida é obrigatória" }),

    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
  });

type SocialColumnsFormData = z.infer<ReturnType<typeof getSocialColumnsSchema>>;

interface ModalSocialColumnsProps {
  onOpenChange: (open: boolean) => void;
  view: boolean;
  deleteImg: boolean;
  title: string;
  id?: number;
  slug?: string;
}

export const ModalSocialColumns = ({
  onOpenChange,
  view,
  deleteImg,
  title,
  id,
  slug,
}: ModalSocialColumnsProps) => {
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    image_url: string;
  } | null>(null);
  const [showConfirmDeleteImage, setShowConfirmDeleteImage] = useState(false);
  const isUpdate = Boolean(id);
  const industrialGuideSchema = getSocialColumnsSchema(isUpdate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SocialColumnsFormData>({
    resolver: zodResolver(industrialGuideSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createSocialColumns = useCreateSocialColumns();
  const updateSocialColumns = useUpdateSocialColumns(id!);
  const deleteImageMutation = useDeleteImgSocialColumns();
  const { data: socialColumns, isLoading } = useSocialColumnsBySlug(slug);

  useEffect(() => {
    if (isUpdate && socialColumns) {
      setValue("title", socialColumns.data.title);
      setValue("description", socialColumns.data.description);
      setValue(
        "created_at",
        new Date(socialColumns.data.created_at).toISOString().slice(0, 16)
      );
      setValue(
        "updated_at",
        new Date(socialColumns.data.updated_at).toISOString().slice(0, 16)
      );
    }
  }, [socialColumns, isUpdate, reset]);

  const onSubmit = async (data: SocialColumnsFormData) => {
    if (view || deleteImg) return; // Não permite submissão em modo visualização ou exclusão

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "main_image" && value instanceof File) {
        formData.append("images[0]", value);
        formData.append("is_cover[0]", "1");
      } else if (key === "images" && Array.isArray(value)) {
        value.forEach((v, index) => {
          formData.append(`images[${index + 1}]`, v);
          formData.append(`images[${index + 1}]`, "0");
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (isUpdate) {
      formData.append("_method", "put");
    }
    const res = isUpdate
      ? await updateSocialColumns.mutateAsync(formData)
      : await createSocialColumns.mutateAsync(formData);
    if (res) {
      reset();
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  if (isLoading) return null;

  const renderImageButtons = (
    id: number,
    image: {
      id: number;
      image_url: string;
    }
  ) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="destructive"
        className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 cursor-pointer"
        type="button"
        onClick={() => {
          setSelectedImage(image);
          setShowConfirmDeleteImage(true);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  const qdtImages = socialColumns ? socialColumns.data.images.length : 0;

  return (
    <>
      <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
        <DialogContent className="md:max-w-4xl w-full aspace-y-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {view
                ? "Visualizando dados do evento"
                : deleteImg
                ? "Gerenciar imagens do evento"
                : "Preencha os dados do evento"}
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
                      label="Evento criado em:"
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
                  name="title"
                  label="Título do Evento"
                  placeholder="Digite o título do evento"
                  description="O título do evento (5-200 caracteres)"
                  required
                  disabled={view || deleteImg}
                />

                {/* description */}
                <CustomInput
                  name="description"
                  label="Descrição"
                  placeholder="Digite a descrição do evento"
                  description="Um resumo ou complemento referente ao evento (Opcional)"
                  disabled={view || deleteImg}
                />

                {/* Carrossel de imagens - sempre visível quando há imagens */}
                {isUpdate &&
                  socialColumns &&
                  socialColumns.data.images.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <CustomCarousel
                          bannerImages={socialColumns.data.images}
                          direction="horizontal"
                          className="max-w-xl"
                          showControls={true}
                          renderCustomButton={
                            deleteImg ? renderImageButtons : undefined
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {qdtImages} imagem
                        {qdtImages !== 1 ? "s" : ""} encontrada
                        {qdtImages !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}

                {/* Campos de imagem - apenas para criação ou edição normal (não deleteImg) */}
                {!isUpdate && !deleteImg && (
                  <>
                    {/* URL da Imagem */}
                    <FormField
                      control={control}
                      name="main_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem da Capa*</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept="image/*"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                              placeholder="Arraste uma imagem ou clique para selecionar"
                              maxSize={5}
                            />
                          </FormControl>
                          <FormDescription>
                            Escolha uma imagem de capa para o evento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagens do Evento*</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept="image/*"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                              placeholder="Arraste uma imagem ou clique para selecionar"
                              maxSize={5}
                              multiple
                            />
                          </FormControl>
                          <FormDescription>
                            As imagens devem ter no máximo 5 MB de tamanho
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Campos de imagem para edição normal (isUpdate + !deleteImg) */}
                {isUpdate && !deleteImg && !view && (
                  <>
                    {/* URL da Imagem */}
                    <FormField
                      control={control}
                      name="main_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Imagem de Capa</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept="image/*"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                              placeholder="Arraste uma nova imagem de capa ou clique para selecionar"
                              maxSize={5}
                            />
                          </FormControl>
                          <FormDescription>
                            Escolha uma nova imagem de capa para o evento
                            (opcional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Novas Imagens do Evento</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept="image/*"
                              onFileSelect={(file) => {
                                field.onChange(file);
                              }}
                              placeholder="Arraste novas imagens ou clique para selecionar"
                              maxSize={5}
                              multiple
                            />
                          </FormControl>
                          <FormDescription>
                            Adicione novas imagens ao evento (opcional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              {/* Botões fixos na parte inferior */}
              {view ? (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Fechar
                  </Button>
                </div>
              ) : deleteImg ? (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Fechar
                  </Button>
                </div>
              ) : (
                <CustomFooterDialog
                  onOpenChange={() => onOpenChange(false)}
                  isSubmitting={isSubmitting}
                  isUpdate={isUpdate}
                  label="Evento"
                />
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={showConfirmDeleteImage}
        onOpenChange={(open) => {
          setShowConfirmDeleteImage(open);
          setSelectedImage(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir está imagem?`}
        onConfirm={() => {
          if (selectedImage) {
            deleteImageMutation.mutate(selectedImage.id);
          }
          setShowConfirmDeleteImage(false);
          setSelectedImage(null);
        }}
      />
    </>
  );
};
