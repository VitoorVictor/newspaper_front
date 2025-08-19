"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface SeeMoreBtnProps {
  path: string;
}

export default function SeeMoreBtn({ path }: SeeMoreBtnProps) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="border border-transparent hover:border-primary/20 transition-colors duration-300 cursor-pointer"
      onClick={() => {
        router.push(path);
      }}
    >
      <span className="mr-2">Veja mais</span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
