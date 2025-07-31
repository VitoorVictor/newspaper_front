import { ReactNode } from "react";
import { auth } from "@/auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth();
  console.log(session);
  return <>{children}</>;
}
