"use client";

import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  quickSearch?: string[];
  showlResults?: boolean;
  totalResults?: number;
}

export function PageHeader({
  title = "Últimas Notícias",
  subtitle = "Fique por dentro das principais informações do setor",
  placeholder = "Busque pelo que desejar...",
  quickSearch,
  showlResults = false,
  totalResults = 245,
}: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Título da página */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {showlResults && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary font-medium"
                >
                  {totalResults} artigos
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-lg">{subtitle}</p>
          </div>

          {/* Barra de pesquisa */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              {/* Campo de busca principal */}
              <div className="relative flex-1 lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder={placeholder}
                  className="pl-12 pr-4 py-3 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-[#1e2d4a] text-white px-4 py-1.5 text-sm font-medium"
                  >
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags de busca rápida */}
            {quickSearch && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Busca rápida:
                </span>
                {quickSearch.map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer whitespace-nowrap text-xs px-3 py-1 h-7 border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 bg-transparent"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
