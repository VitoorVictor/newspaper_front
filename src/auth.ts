import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<{ email: string } | null> => {
        try {
          const { email, password } = credentials;

          const response = await axios.post(process.env.API_LOGIN_URL!, {
            email,
            password,
          });

          if (response.status === 200 && response.data) {
            const { access_token } = response.data;

            if (access_token) {
              (await cookies()).set({
                name: "access_token",
                value: access_token,
                httpOnly: false,
                path: "/",
                maxAge: 60 * 60,
              });
            }

            return { email: email as string };
          }

          return null;
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              return null; // Credenciais inválidas → NextAuth gera CredentialsSignin
            }
          }

          console.error("Erro inesperado no authorize:", error);
          // Caso seja um erro grave, lançamos com um código customizado
          throw new Error("INTERNAL_SERVER_ERROR");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // Adicione o email ao token se o usuário estiver presente
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicione o email ao objeto de sessão
      if (token) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
