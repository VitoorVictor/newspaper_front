"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface ReadMoreBtnProps {
  path: string;
}

export default function ReadMoreBtn({ path }: ReadMoreBtnProps) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 text-primary hover:bg-white/80 backdrop-blur-sm"
      onClick={() => {
        router.push(path);
      }}
    >
      Ler mais
    </Button>
  );
}
