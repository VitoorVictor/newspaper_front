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
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { CustomInput } from "../custom-inputs/input";
import {
  useCreateUser,
  useUpdateUser,
  useUserById,
} from "@/hooks/tanstackQuery/useUser";

const getUserSchema = (isUpdate: boolean) => {
  return z
    .object({
      name: z
        .string({ message: "Obrigatório" })
        .min(5, "O nome deve ter pelo menos 5 caracteres")
        .max(200, "O nome deve ter no máximo 200 caracteres"),
      email: z
        .string({ message: "Obrigatório" })
        .email({ message: "Deve ser um email válido" }),
      password: isUpdate
        ? z.string().optional().or(z.literal(""))
        : z
            .string({ message: "Obrigatório" })
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .max(200, "A senha deve ter no máximo 200 caracteres"),
      password_confirmation: isUpdate
        ? z.string().optional().or(z.literal(""))
        : z
            .string({ message: "Obrigatório" })
            .min(6, "A confirmação deve ter pelo menos 6 caracteres")
            .max(200, "A confirmação deve ter no máximo 200 caracteres"),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "As senhas não coincidem",
      path: ["password_confirmation"],
    });
};

type UserFormData = z.infer<ReturnType<typeof getUserSchema>>;

interface ModalUserProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  id?: number;
}
export const ModalUser = ({ onOpenChange, title, id }: ModalUserProps) => {
  const isUpdate = Boolean(id);
  const form = useForm<UserFormData>({
    resolver: zodResolver(getUserSchema(isUpdate)),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { reset, handleSubmit } = form;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser(id!);
  const { data: user, isLoading } = useUserById(id);

  useEffect(() => {
    if (isUpdate && user) {
      reset(user.data);
    }
  }, [user, isUpdate, reset]);

  const onSubmit = async (data: UserFormData) => {
    const res = isUpdate
      ? await updateUser.mutateAsync(data)
      : await createUser.mutateAsync(data);
    if (res) {
      reset();
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
      <DialogContent>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Preencha os dados do usuário</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col space-y-6"
          >
            {/* nome */}
            <CustomInput
              name="name"
              label="Nome"
              placeholder="Digite o nome do usuário"
              required
            />

            {/* email */}
            <CustomInput
              name="email"
              label="Email"
              placeholder="Digite o email do usuário"
              type="email"
              required
            />

            {/* nome */}
            {!isUpdate && (
              <CustomInput
                name="password"
                label="Senha"
                description="A senha deve ter mais de 6 caractéres"
                type="password"
                required
              />
            )}

            {/* nome */}
            {!isUpdate && (
              <CustomInput
                name="password_confirmation"
                label="Confirmação de senha"
                description="A confirmação deve coincidir com a senha"
                type="password"
                required
              />
            )}

            {/* Botões fixos na parte inferior */}
            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isUpdate ? "Atualizar" : "Criar"} Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
