import { auth } from "@/auth";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await auth();
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <AppSidebar session={session} />
      <Navbar email={session?.user.email || ""} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
