// src/columns/index.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { INews } from "@/interfaces/news";
import { ICategory } from "@/interfaces/category";

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
    render: (item: INews) => (
      <div>
        <div className="font-medium">{item.title}</div>
        <div className="text-sm text-muted-foreground truncate max-w-xs">
          {/* Subtítulo, se houver */}
        </div>
      </div>
    ),
  },
  {
    key: "badge",
    title: "Editoria",
    render: (item: INews) => <Badge variant="outline">{item.badge}</Badge>,
  },
  {
    key: "status",
    title: "Status",
    render: (item: INews) => (
      <Badge variant={item.status === "published" ? "default" : "secondary"}>
        {item.status}
      </Badge>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: INews) => (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(item)}>
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
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(item)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
