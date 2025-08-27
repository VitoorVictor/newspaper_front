"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/custom-inputs/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Send } from "lucide-react";

// Schema de validação para o formulário de contato
const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Aqui você pode implementar a lógica para enviar o formulário
      console.log("Dados do formulário:", data);

      // Exemplo de envio para API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })

      // Reset do formulário após sucesso
      form.reset();
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl ml-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="name"
            label="Nome"
            placeholder="Seu nome completo"
            required
            type="text"
          />

          <CustomInput
            name="email"
            label="Email"
            placeholder="seu@email.com"
            required
            type="email"
          />
        </div>

        <CustomInput
          name="subject"
          label="Assunto"
          placeholder="Assunto da mensagem"
          required
          type="text"
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite sua mensagem aqui..."
                  className="min-h-32 resize-none"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 inline-block text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                ></svg>
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Mensagem
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
