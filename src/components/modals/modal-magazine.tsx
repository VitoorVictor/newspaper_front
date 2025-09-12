import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  useCreateMagazine,
  useMagazineBySlug,
  useUpdateMagazine,
} from "@/hooks/tanstackQuery/useMagazine";
import { FileUpload } from "../file-upload";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CustomInput } from "../custom-inputs/input";
import { CustomFooterDialog } from "../custom-footer-dialog";

const getMagazineSchema = (isUpdate: boolean) =>
  z.object({
    title: z
      .string({ message: "Obrigatório" })
      .min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val))
      .optional()
      .nullable(),
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
    file: isUpdate
      ? z
          .custom<File>(
            (file) => {
              if (file === undefined || file === null || file === "")
                return true;
              return file instanceof File && file.size > 0;
            },
            { message: "Arquivo inválida" }
          )
          .optional()
          .nullable()
      : z.custom<File>(
          (file) => {
            return file instanceof File && file.size > 0;
          },
          { message: "Arquivo inválido" }
        ),
    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
  });

type MagazineFormData = z.infer<ReturnType<typeof getMagazineSchema>>;

interface ModalMagazineProps {
  onOpenChange: (open: boolean) => void;
  view: boolean;
  title: string;
  id?: number;
  slug?: string;
}

export const ModalMagazine = ({
  onOpenChange,
  view,
  title,
  id,
  slug,
}: ModalMagazineProps) => {
  const isUpdate = Boolean(id);
  const magazineSchema = getMagazineSchema(isUpdate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<MagazineFormData>({
    resolver: zodResolver(magazineSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createMagazine = useCreateMagazine();
  const updateMagazine = useUpdateMagazine(id!);
  const { data, isLoading } = useMagazineBySlug(slug);
  const magazine = data?.data.magazine;

  useEffect(() => {
    if (isUpdate && magazine) {
      setValue("title", magazine.title);
      setValue("description", magazine.description);
      setValue(
        "created_at",
        new Date(magazine.created_at).toISOString().slice(0, 16)
      );
      setValue(
        "updated_at",
        new Date(magazine.updated_at).toISOString().slice(0, 16)
      );
    }
  }, [magazine, isUpdate, reset]);

  const onSubmit = async (data: MagazineFormData) => {
    if (view) return;

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url" && value instanceof File) {
        formData.append("image_url", value);
      } else if (key === "file" && value instanceof File) {
        formData.append("file", value);
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
      ? await updateMagazine.mutateAsync(formData)
      : await createMagazine.mutateAsync(formData);
    if (res) {
      reset();
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  if (isLoading) return null;

  return (
    <>
      <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
        <DialogContent
          className="md:max-w-4xl w-full aspace-y-6"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {view
                ? "Visualizando dados da edição da revista"
                : "Preencha os dados da edição da revista"}
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
                  label="Título da Revista"
                  placeholder="Digite o título da revista"
                  description="O título da revista (5-200 caracteres)"
                  required
                  disabled={view}
                />

                {/* description */}
                <CustomInput
                  name="description"
                  label="Descrição"
                  placeholder="Digite a descrição da revista"
                  description="Um resumo ou complemento referente à revista (Opcional)"
                  disabled={view}
                />

                {/* URL da Imagem */}
                <FormField
                  control={control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem da Capa*</FormLabel>
                      <FormControl>
                        {view ? (
                          <div className="p-4 border rounded-md bg-gray-50 flex justify-center items-center">
                            {magazine?.image_url ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.image_url}`}
                                alt="Imagem da edição"
                                width={256}
                                height={144}
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
                                    `${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine?.image_url}`,
                                  ]
                                : []
                            }
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Escolha uma imagem de capa para a edição
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* file */}
                <FormField
                  control={control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arquivo PDF *</FormLabel>
                      <FormControl>
                        {view ? (
                          <div className="p-4 border rounded-md bg-gray-50">
                            {magazine?.file ? (
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-red-600"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {magazine.file instanceof File
                                        ? magazine.file.name
                                        : "Arquivo PDF"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Arquivo PDF da edição
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                      </svg>
                                      Visualizar
                                    </a>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                  Clique em &quot;Visualizar&quot; para abrir o
                                  PDF em uma nova aba
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-500 font-medium">
                                  Nenhum arquivo PDF selecionado
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Esta edição não possui arquivo PDF anexado
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <FileUpload
                            accept="application/pdf"
                            onFileSelect={(file) => {
                              if (!view) field.onChange(file);
                            }}
                            placeholder="Arraste um arquivo PDF ou clique para selecionar"
                            maxSize={50}
                            hasPreview={
                              isUpdate
                                ? [
                                    `${process.env.NEXT_PUBLIC_IMAGE_URL}${magazine?.file}`,
                                  ]
                                : []
                            }
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Escolha um arquivo PDF para a edição
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              ) : (
                <CustomFooterDialog
                  onOpenChange={() => onOpenChange(false)}
                  isSubmitting={isSubmitting}
                  isUpdate={isUpdate}
                  label="Edição de Revista"
                />
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
