import AddBtn from "@/components/custom-btns/add-btn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  trigger?: React.ReactNode;
}

const noticiaSchema = z.object({
  title: z
    .string({ message: "Obrigatório" })
    .min(5, "O título deve ter pelo menos 5 caracteres")
    .max(200, "O título deve ter no máximo 200 caracteres"),
  sub_title: z
    .string({ message: "Obrigatório" })
    .min(10, "O subtítulo deve ter pelo menos 10 caracteres")
    .max(300, "O subtítulo deve ter no máximo 300 caracteres"),
  content: z
    .string()
    .min(50, "O conteúdo deve ter pelo menos 50 caracteres")
    .optional(), // Opcional por enquanto até implementar rich text
  image_url: z
    .string()
    .url("Digite uma URL válida")
    .optional()
    .or(z.literal("")),
  badge: z.string({ message: "Obrigatório" }).min(1, "Selecione um tópico"),
  top_position: z.boolean().default(false).optional(),
});

type NoticiaFormData = z.infer<typeof noticiaSchema>;

export const Modal = ({ open, onOpenChange, title, trigger }: ModalProps) => {
  const form = useForm<NoticiaFormData>({
    resolver: zodResolver(noticiaSchema),
  });

  const { reset, handleSubmit, control } = form;

  const onSubmit = (data: NoticiaFormData) => {
    console.log(data);
    reset();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <AddBtn label="Nova Notícia" onClick={() => onOpenChange(true)} />
        )}
      </DialogTrigger>
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

              {/* Conteúdo - Placeholder para Rich Text */}
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo *</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <div className="text-muted-foreground">
                          <div className="text-lg font-medium mb-2">
                            Rich Text Editor
                          </div>
                          <div className="text-sm">
                            Este espaço será substituído pelo editor de texto
                            rico
                          </div>
                        </div>
                        {/* Textarea temporária para desenvolvimento */}
                        <Textarea
                          placeholder="Conteúdo temporário (será substituído pelo rich text)"
                          className="mt-4"
                          rows={4}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      O conteúdo completo da notícia será editado com rich text
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
                      URL da imagem principal da notícia (opcional)
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
                          <SelectTrigger>
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
