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
import {
  Send,
  Mail,
  MessageCircle,
  Phone,
  Users,
  Briefcase,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PhoneInput } from "../custom-inputs/phone-input";
import contactService from "@/services/contact";
import { toast } from "react-toastify";

// Schema de validação para o formulário de contato
const contactFormSchema = z.object({
  name: z
    .string({ message: "Obrigatório" })
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string({ message: "Obrigatório" }).email("Email inválido"),
  phone: z
    .string({ message: "Obrigatório" })
    .min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z
    .string({ message: "Obrigatório" })
    .min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Componente de animação reutilizável
const AnimatedIcon = ({
  icons,
  title,
  subtitle,
}: {
  icons: Array<{ icon: any; color: string; bgColor: string }>;
  title: string;
  subtitle: string;
}) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIcon((prev) => (prev + 1) % icons.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIcon].icon;

  return (
    <div
      className={`relative h-[500px] w-full rounded-lg overflow-hidden flex items-center justify-center`}
    >
      {/* Ícone animado */}
      <div className="relative">
        <div
          className={`w-32 h-32 rounded-full ${
            icons[currentIcon].bgColor
          } flex items-center justify-center transition-all duration-500 ${
            isAnimating ? "scale-110 rotate-12" : "scale-100 rotate-0"
          }`}
        >
          <CurrentIcon
            className={`w-16 h-16 ${
              icons[currentIcon].color
            } transition-all duration-500 ${
              isAnimating ? "scale-125" : "scale-100"
            }`}
          />
        </div>

        {/* Círculos decorativos */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-200 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-200 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-200 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Texto sobreposto */}
      <div className="absolute bottom-8 left-8 right-8 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-lg text-gray-600 mb-4">{subtitle}</p>

        {/* Indicadores de animação */}
        <div className="flex justify-center space-x-2">
          {icons.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIcon ? "bg-blue-500 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-blue-200 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-16 left-12 w-12 h-12 border-2 border-green-200 rounded-full animate-spin-slow-reverse"></div>
    </div>
  );
};

// Animações específicas para cada tópico
export const ContactAnimation = () => {
  const icons = [
    { icon: Mail, color: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: MessageCircle, color: "text-green-500", bgColor: "bg-green-100" },
    { icon: Phone, color: "text-purple-500", bgColor: "bg-purple-100" },
  ];

  return (
    <AnimatedIcon
      icons={icons}
      title="Entre em Contato"
      subtitle="Estamos aqui para ajudar você!"
    />
  );
};

export const WorkWithUsAnimation = () => {
  const icons = [
    { icon: Users, color: "text-emerald-500", bgColor: "bg-emerald-100" },
    { icon: Briefcase, color: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: Phone, color: "text-indigo-500", bgColor: "bg-indigo-100" },
  ];

  return (
    <AnimatedIcon
      icons={icons}
      title="Trabalhe Conosco"
      subtitle="Faça parte da nossa equipe!"
    />
  );
};

export const AdvertiseAnimation = () => {
  const icons = [
    { icon: Megaphone, color: "text-orange-500", bgColor: "bg-orange-100" },
    { icon: Briefcase, color: "text-red-500", bgColor: "bg-red-100" },
    { icon: MessageCircle, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  ];

  return (
    <AnimatedIcon
      icons={icons}
      title="Anuncie Conosco"
      subtitle="Alcance milhares de leitores!"
    />
  );
};

export const SubscribeAnimation = () => {
  const icons = [
    { icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-100" },
    { icon: Mail, color: "text-pink-500", bgColor: "bg-pink-100" },
    { icon: MessageCircle, color: "text-violet-500", bgColor: "bg-violet-100" },
  ];

  return (
    <AnimatedIcon
      icons={icons}
      title="Assinar Revista"
      subtitle="Receba nossas edições em casa!"
    />
  );
};

export const ContactForm = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await contactService.create(data);

      if (res && res.status === 200) {
        form.reset();
        toast.success("Mensagem enviada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Animação - visível apenas em lg e acima */}
      <div className="hidden lg:block">{children}</div>

      {/* Formulário */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput
              name="name"
              label="Nome"
              placeholder="Seu nome completo"
              required
              type="text"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                name="email"
                label="Email"
                placeholder="seu@email.com"
                required
                type="email"
              />
              <PhoneInput
                name="phone"
                label="Telefone"
                placeholder="(00) 00000-0000"
              />
            </div>

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
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
