"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Title } from "./title";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  quickSearch?: string[];
  showlResults?: boolean;
  totalResults?: number;
  searchMode?: "query" | "redirect";
  searchParamKey?: string;
  searchParamKeyQS?: string;
  redirectBasePath?: string;
}

export function PageHeader({
  title = "Últimas Notícias",
  subtitle = "Fique por dentro das principais informações do setor",
  placeholder = "Busque pelo que desejar...",
  quickSearch,
  showlResults = false,
  totalResults,
  searchMode = "query",
  searchParamKey = "pesquisa",
  searchParamKeyQS,
  redirectBasePath = "/buscar",
}: PageHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string, type: "search" | "quickSearch") => {
    if (!term.trim()) return;

    if (searchMode === "query") {
      const params = new URLSearchParams(searchParams.toString());
      params.set(type === "search" ? searchParamKey : searchParamKeyQS!, term);
      router.push(`?${params.toString()}`);
    } else {
      router.push(
        `${redirectBasePath}?${searchParamKey}=${encodeURIComponent(term)}`
      );
    }
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchParamKey);
    router.push(`?${params.toString()}`);
  };

  const clearQuickSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchParamKeyQS!);
    router.push(`?${params.toString()}`);
  };

  const currentQuickSearchValue = searchParamKeyQS
    ? searchParams.get(searchParamKeyQS)
    : null;

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <Title
            title={title}
            subtitle={subtitle}
            showlResults={showlResults}
            totalResults={totalResults}
          />

          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>

                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder}
                  className="pl-12 pr-10 py-3 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(searchTerm, "search");
                  }}
                />

                {/* Botão Clear (aparece só se tiver texto) */}
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      clearSearch();
                    }}
                    type="button"
                    aria-label="Limpar busca"
                    className="absolute inset-y-0 right-18 flex items-center pr-3 text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-[#1e2d4a] text-white px-4 py-1.5 text-sm font-medium"
                    onClick={() => handleSearch(searchTerm, "search")}
                  >
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            {quickSearch && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Busca rápida:
                </span>
                {quickSearch.map((tag, index) => {
                  const isActive = currentQuickSearchValue === tag;

                  return (
                    <Button
                      key={index}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`cursor-pointer whitespace-nowrap text-xs px-3 py-1 h-7 border-gray-200 text-gray-600 transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary text-white hover:bg-[#1e2d4a] hover:border-primary"
                          : "hover:bg-primary hover:text-white hover:border-primary bg-transparent"
                      }`}
                      onClick={() =>
                        isActive
                          ? clearQuickSearch()
                          : handleSearch(tag, "quickSearch")
                      }
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
