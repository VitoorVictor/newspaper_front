import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ISocialColumns } from "@/interfaces/social-column";
import { Edit, Trash2 } from "lucide-react";

// Colunas para Coluna Social
export const getSocialColumnsColumns = ({
  onView,
  onEdit,
  onDelete,
  onDeleteImg,
}: {
  onView: (item: ISocialColumns) => void;
  onEdit: (item: ISocialColumns) => void;
  onDelete: (item: ISocialColumns) => void;
  onDeleteImg: (item: ISocialColumns) => void;
}) => [
  {
    key: "title",
    title: "Título",
    render: (item: ISocialColumns) => (
      <span className="font-medium">{item.title}</span>
    ),
  },
  {
    key: "quantity",
    title: "Qtd de Imagens",
    render: (item: ISocialColumns) => {
      const count = item.images.length;
      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            count === 0
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {count} {count === 1 ? "imagem" : "imagens"}
        </span>
      );
    },
  },
  {
    key: "slug",
    title: "Referência",
    render: (item: ISocialColumns) => (
      <button
        className="flex gap-1"
        onClick={() => console.log("leva para o card da industria")}
      >
        <Badge variant="outline">{item.slug}</Badge>
      </button>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: ISocialColumns) => (
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
