// src/columns/index.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { INews } from "@/interfaces/news";
import { ICategory } from "@/interfaces/category";
import SlugColumnBtn from "@/components/custom-btns/slug-column-btn";

// Colunas para News
export const getNewsColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: INews) => void;
  onDelete: (item: INews) => void;
}) => [
  {
    key: "title",
    title: "Título",
    render: (item: INews) => <span className="font-medium">{item.title}</span>,
  },
  {
    key: "category_ids",
    title: "Editoria(s)",
    render: (item: INews) => (
      <div className="flex gap-1">
        {item.categories.map((category, index) => (
          <Badge
            variant="outline"
            className={index > 2 ? "hidden" : ""}
            key={index}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "status",
    title: "Status",
    render: (item: INews) => (
      <Badge variant={item.status === "published" ? "default" : "secondary"}>
        {item.status === "published" ? "publicada" : "rascunho"}
      </Badge>
    ),
  },
  {
    key: "slug",
    title: "Referência",
    render: (item: INews) => (
      <SlugColumnBtn slug={item.slug} url={`/noticia/${item.slug}`} />
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: INews) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

// Colunas para Categorias
export const getCategoriesColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: ICategory) => void;
  onDelete: (item: ICategory) => void;
}) => [
  {
    key: "name",
    title: "Nome",
    render: (item: ICategory) => (
      <span className="font-medium">{item.name}</span>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: ICategory) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
