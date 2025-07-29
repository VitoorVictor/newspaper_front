"use client";

import { logoutAction } from "@/app/actions/auth";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = () => {
    startTransition(async () => {
      const res = await logoutAction();
      if (res.success) {
        router.push("/admin/entrar");
      }
    });
  };

  return (
    <form action={onSubmit} className="w-full">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 cursor-pointer w-full text-left"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {isPending ? "Saindo..." : "Sair"}
      </button>
    </form>
  );
}
