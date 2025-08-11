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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  useCreateNews,
  useNewsById,
  useUpdateNews,
} from "@/hooks/tanstackQuery/useNews";
import { FileUpload } from "../file-upload";
import { ICategory } from "@/interfaces/category";
import { useEffect } from "react";
import { CustomMultiSelect } from "../custom-selects/custom-multi-select";
import { CustomInput } from "../custom-inputs/input";

const getNewsSchema = (isUpdate: boolean) =>
  z.object({
    title: z
      .string({ message: "Obrigatório" })
      .min(5, "O título deve ter pelo menos 5 caracteres")
      .max(200, "O título deve ter no máximo 255 caracteres"),
    sub_title: z
      .string({ message: "Obrigatório" })
      .min(10, "O subtítulo deve ter pelo menos 10 caracteres")
      .max(300, "O subtítulo deve ter no máximo 255 caracteres"),
    content: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres"),

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

    badge: z.string().optional().nullable(),
    top_position: z.string().optional().nullable(),
    status: z.literal("published").or(z.literal("draft")),
    category_ids: z
      .array(z.number(), {
        message: "Selecione pelo menos um tópico",
      })
      .min(1, "A notícia deve ter ao menos 1 categoria."),
    categories: z
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

type NewsFormData = z.infer<ReturnType<typeof getNewsSchema>>;

interface ModalNewsProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  categories: ICategory[];
  id?: number;
}

export const ModalNews = ({
  onOpenChange,
  title,
  categories,
  id,
}: ModalNewsProps) => {
  const isUpdate = Boolean(id);
  const newsSchema = getNewsSchema(isUpdate);
  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      sub_title: "",
      content: "",
      image_url: undefined,
      badge: "",
      top_position: "",
      status: "published",
      category_ids: [],
      created_at: "",
      updated_at: "",
    },
  });

  const { reset, setValue, handleSubmit, control } = form;
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(id!);
  const { data: news, isLoading } = useNewsById(id);

  useEffect(() => {
    if (isUpdate && news) {
      setValue("title", news.data.title);
      setValue("sub_title", news.data.sub_title);
      setValue("badge", news.data.badge);
      setValue(
        "category_ids",
        news.data.categories.map((category) => category.id)
      );
      setValue("content", news.data.content);
      setValue("created_at", news.data.created_at);
      setValue("updated_at", news.data.updated_at);
      setValue("top_position", news.data.top_position);
    }
  }, [news, isUpdate, reset]);

  const onSubmit = async (data: NewsFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url" && value instanceof File) {
        formData.append("image_url", value);
      } else if (key === "category_ids" && Array.isArray(value)) {
        value.forEach((id) => formData.append("category_ids[]", String(id)));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (isUpdate) {
      formData.append("_method", "put");
    }
    const res = isUpdate
      ? await updateNews.mutateAsync(formData)
      : await createNews.mutateAsync(formData);
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
          <DialogDescription>Preencha os dados da notícia</DialogDescription>
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
                  {/* Título */}
                  <CustomInput
                    name="created_at"
                    label="Nóticia criada em:"
                    type="datetime"
                    disabled
                  />
                  {/* Título */}
                  <CustomInput
                    name="updated_at"
                    label="Última alteração em:"
                    type="datetime"
                    disabled
                  />
                </div>
              )}
              {/* Título */}
              <CustomInput
                name="title"
                label="Título"
                placeholder="Digite o título da notícia"
                description="O título principal da notícia (5-200 caracteres)"
                required
              />
              {/* Subtítulo */}
              <CustomInput
                name="sub_title"
                label="Subtítulo"
                placeholder="Digite o subtítulo da notícia"
                description=" Um resumo ou complemento do título (10-300 caracteres)"
                required
              />
              {/* Editoria */}
              <CustomMultiSelect
                label="Editoria"
                placeholder="Selecione a editoria"
                name="category_ids"
                data={categories}
                fieldValue="id"
                fieldLabel="name"
                containerClassName="w-full"
              />
              {/* Conteúdo - Rich Text Editor */}
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Use o editor para formatar o conteúdo da notícia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
                            ? `${process.env.NEXT_PUBLIC_IMAGE_UR}${news?.data.image_url}`
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Situação *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="min-w-40 w-full">
                            <SelectValue placeholder="Selecione uma situação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { value: "published", label: "Publicar" },
                            { value: "draft", label: "Rascunho" },
                          ].map((topico) => (
                            <SelectItem key={topico.value} value={topico.value}>
                              {topico.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Posição Superior */}
                <FormField
                  control={control}
                  name="top_position"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Posição da Notícia *</FormLabel>
                      <Select
                        defaultValue={field.value || "nothing"}
                        onValueChange={(value) =>
                          value === "nothing"
                            ? field.onChange(null)
                            : field.onChange(value)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="min-w-40 w-full">
                            <SelectValue placeholder="Selecione uma posição" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { value: "nothing", label: "Nenhuma" },
                            { value: "main_top", label: "Principal do site" },
                            { value: "top_1", label: "Topo em primeira" },
                            { value: "top_2", label: "Topo em segunda" },
                            { value: "top_3", label: "Topo em teceira" },
                          ].map((topico) => (
                            <SelectItem key={topico.value} value={topico.value}>
                              {topico.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Crácha */}
              <CustomInput
                name="badge"
                label="Crachá"
                placeholder="Digite o crachá da notícia"
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
