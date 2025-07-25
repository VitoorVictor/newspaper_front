"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch: (searchTerm: string) => void;
  onClear?: () => void;
  className?: string;
}

interface SearchFormData {
  searchTerm: string;
}

export function SearchBar({
  placeholder = "Pesquisar...",
  value = "",
  onSearch,
  onClear,
  className = "",
}: SearchBarProps) {
  const { register, handleSubmit, watch, setValue, reset } =
    useForm<SearchFormData>({
      defaultValues: {
        searchTerm: value,
      },
    });

  const searchTerm = watch("searchTerm");

  // Sincroniza o valor externo com o formulário
  useEffect(() => {
    setValue("searchTerm", value);
  }, [value, setValue]);

  // Chama onSearch quando o valor muda (pesquisa em tempo real)
  useEffect(() => {
    onSearch(searchTerm || "");
  }, [searchTerm, onSearch]);

  const handleSearchSubmit = (data: SearchFormData) => {
    onSearch(data.searchTerm || "");
  };

  const handleClear = () => {
    reset({ searchTerm: "" });
    onSearch("");
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearchSubmit)}
      className={`relative flex gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...register("searchTerm")}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar pesquisa</span>
          </Button>
        )}
      </div>
      <Button
        type="submit"
        variant="outline"
        className="shrink-0 bg-transparent"
      >
        <Search className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </form>
  );
}
