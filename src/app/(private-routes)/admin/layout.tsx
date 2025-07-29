import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  console.log(session);
  if (!session?.user || session === null) {
    notFound();
  }
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <AppSidebar session={session} />
      <Navbar email={session?.user.email || ""} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
