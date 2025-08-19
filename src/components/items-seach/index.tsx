"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface ItemsSearchProps<T extends { name: string }> {
  data: T[];
  searchMode?: "query" | "redirect";
  redirectBasePath?: string;
  searchParamKeyQS?: string;
  onItemClick?: (item: T) => void;
}

export function ItemsSearch<T extends { name: string }>({
  data,
  searchMode = "query",
  redirectBasePath = "/buscar",
  searchParamKeyQS = "search",
  onItemClick,
}: ItemsSearchProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedValue = searchParamKeyQS
    ? searchParams.get(searchParamKeyQS)
    : null;

  function handleClick(item: T) {
    if (onItemClick) {
      onItemClick(item);
    } else {
      const term = item.name;
      if (searchMode === "query") {
        const params = new URLSearchParams(searchParams.toString());
        params.set(searchParamKeyQS, term);
        router.push(`?${params.toString()}`);
      } else {
        router.push(
          `${redirectBasePath}/${encodeURIComponent(term)}`
        );
      }
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
          {data.map((item, index) => {
            const isSelected = item.name === selectedValue;

            return (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleClick(item)}
                className={`
                  flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 h-10 cursor-pointer rounded-md
                  border-b-2
                  transition-colors duration-300 ease-in-out
                  ${
                    isSelected
                      ? "border-primary text-primary font-semibold rounded-b-none"
                      : "border-transparent text-gray-700 hover:text-primary"
                  }
                `}
              >
                <span className="font-medium">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
