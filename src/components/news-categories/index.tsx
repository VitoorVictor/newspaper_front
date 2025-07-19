"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Política" },
  { name: "Economia" },
  { name: "Internacional" },
  { name: "Negócios" },
  { name: "Tecnologia" },
  { name: "Energia" },
  { name: "Automotivo" },
  { name: "Saúde" },
  { name: "Entretenimento" },
];

export function NewsCategories() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => {
            return (
              <Button
                key={index}
                variant={false ? "default" : "ghost"}
                className={`
                  flex items-center gap-2 whitespace-nowrap min-w-fit px-4 py-2 h-10
                  ${
                    false
                      ? "bg-primary text-white hover:bg-[#1e2d4a]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
