"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface SeeMoreBtnProps {
  path: string;
  label?: string;
  className?: string;
  variant?: "outline" | "ghost" | "default";
}

export default function SeeMoreBtn({
  path,
  label = "Veja mais",
  className,
  variant = "ghost",
}: SeeMoreBtnProps) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      size="sm"
      className={clsx(
        "border border-transparent hover:border-primary/20 transition-colors duration-300 cursor-pointer",
        className
      )}
      onClick={() => {
        router.push(path);
      }}
    >
      <span className="mr-2">{label}</span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
