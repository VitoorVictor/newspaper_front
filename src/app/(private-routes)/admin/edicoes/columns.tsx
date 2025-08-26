import { Button } from "@/components/ui/button";
import { IMagazine } from "@/interfaces/magazine";
import { Edit, Eye, Trash2 } from "lucide-react";
import SlugColumnBtn from "@/components/custom-btns/slug-column-btn";
import { formatDateTime } from "@/utils/formatDateTime";

// Colunas para Coluna Social
export const getMagazineColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (item: IMagazine) => void;
  onEdit: (item: IMagazine) => void;
  onDelete: (item: IMagazine) => void;
}) => [
  {
    key: "title",
    title: "Título",
    render: (item: IMagazine) => (
      <span className="font-medium">{item.title}</span>
    ),
  },
  {
    key: "slug",
    title: "Referência",
    render: (item: IMagazine) => (
      <SlugColumnBtn slug={item.slug} url={`/edicoes/${item.slug}`} />
    ),
  },
  {
    key: "created_at",
    title: "Criado em",
    render: (item: IMagazine) => (
      <span className="font-medium">{formatDateTime(item.created_at)}</span>
    ),
  },
  {
    key: "updated_at",
    title: "Ultima alteração em",
    render: (item: IMagazine) => (
      <span className="font-medium">{formatDateTime(item.updated_at)}</span>
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: IMagazine) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => onView(item)}
        >
          <Eye className="w-4 h-4" />
        </Button>
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
