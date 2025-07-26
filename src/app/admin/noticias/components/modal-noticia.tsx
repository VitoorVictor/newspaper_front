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
import { Switch } from "@/components/ui/switch";
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
import { useCreateNews } from "@/hooks/tanstackQuery/useNews";

interface ModalNoticiaProps {
  onOpenChange: (open: boolean) => void;
  title: string;
}

const noticiaSchema = z.object({
  title: z
    .string({ message: "Obrigatório" })
    .min(5, "O título deve ter pelo menos 5 caracteres")
    .max(200, "O título deve ter no máximo 255 caracteres"),
  sub_title: z
    .string({ message: "Obrigatório" })
    .min(10, "O subtítulo deve ter pelo menos 10 caracteres")
    .max(300, "O subtítulo deve ter no máximo 255 caracteres"),
  content: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres"),
  image_url: z.string().url("Digite uma URL válida"),
  badge: z.string({ message: "Obrigatório" }).min(1, "Selecione um tópico"),
  top_position: z.boolean().default(false).optional(),
  status: z.literal("published").or(z.literal("draft")),
});

type NoticiaFormData = z.infer<typeof noticiaSchema>;

export const ModalNoticia = ({ onOpenChange, title }: ModalNoticiaProps) => {
  const form = useForm<NoticiaFormData>({
    resolver: zodResolver(noticiaSchema),
    defaultValues: {
      title: "",
      sub_title: "",
      content: "",
      image_url: "",
      badge: "",
      top_position: false,
      status: "published",
    },
  });

  const { reset, handleSubmit, control } = form;
  const createNews = useCreateNews();

  const onSubmit = async (data: NoticiaFormData) => {
    const res = await createNews.mutateAsync(data);
    if (res) {
      reset();
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="md:max-w-4xl w-full">
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
            <div className="flex-1 max-h-[70vh] overflow-y-auto px-2 space-y-6">
              {/* Título */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título da notícia"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      O título principal da notícia (5-200 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subtítulo */}
              <FormField
                control={control}
                name="sub_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o subtítulo da notícia"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Um resumo ou complemento do título (10-300 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
                        placeholder="Digite o conteúdo da notícia..."
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
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL da imagem principal da notícia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                {/* Tópico */}
                <FormField
                  control={control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tópico *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="min-w-40">
                            <SelectValue placeholder="Selecione um tópico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { id: "1", nome: "Esports" },
                            { id: "2", nome: "Tecnologia" },
                            { id: "3", nome: "Games" },
                            { id: "4", nome: "Hardware" },
                            { id: "5", nome: "Software" },
                          ].map((topico) => (
                            <SelectItem key={topico.id} value={topico.id}>
                              {topico.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectTrigger className="min-w-40">
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
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Posição Superior
                          </FormLabel>
                          <FormDescription>
                            Destacar esta notícia
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
                {false ? "Atualizar" : "Criar"} Notícia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
