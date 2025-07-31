"use server";

import { signIn, signOut } from "@/auth";

interface LoginData {
  email: string;
  password: string;
}

export async function loginAction(data: LoginData) {
  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    return { success: true };
  } catch (err: any) {
    if (err.type === "CredentialsSignin") {
      return { error: "Credenciais inválidas. Tente novamente." };
    }

    return { error: "Erro inesperado. Tente novamente." };
  }
}

export async function logoutAction() {
  try {
    await signOut({
      redirect: false,
    });

    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao deslogar. Tente novamente." };
  }
}
