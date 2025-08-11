"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function CustomPagination({
  totalPages,
  currentPage,
}: CustomPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para alterar a página na URL, mantendo outros params
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    const url = `${window.location.pathname}?${params.toString()}`;
    router.push(url);
  }

  // Calcula as 3 páginas dinâmicas para mostrar no meio
  // Garante que não ultrapasse os limites entre 2 e totalPages -1
  function getDynamicPages() {
    const pages = [];

    // Se totalPages <= 5, só mostra tudo direto
    if (totalPages <= 5) {
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Páginas dinâmicas: sempre 3
    let start = currentPage - 1;
    if (start < 2) start = 2;
    if (start > totalPages - 4) start = totalPages - 4;

    for (let i = start; i < start + 3; i++) {
      pages.push(i);
    }
    return pages;
  }

  const dynamicPages = getDynamicPages();

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${
            currentPage === 1 ? "" : "cursor-pointer"
          }`}
        >
          Anterior
        </button>

        {/* Página 1 fixa */}
        <button
          onClick={() => goToPage(1)}
          className={`px-4 py-2 text-sm rounded-lg cursor-pointer ${
            currentPage === 1
              ? "bg-[#182641] text-white"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          1
        </button>

        {/* Páginas dinâmicas do meio */}
        {dynamicPages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 text-sm rounded-lg cursor-pointer ${
              currentPage === page
                ? "bg-[#182641] text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Página última fixa */}
        {totalPages > 1 && (
          <button
            onClick={() => goToPage(totalPages)}
            className={`px-4 py-2 text-sm rounded-lg cursor-pointer ${
              currentPage === totalPages
                ? "bg-[#182641] text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {totalPages}
          </button>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${
            currentPage === totalPages ? "" : "cursor-pointer"
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
