import { Button } from "@/components/ui/button";
import { ISocialColumn } from "@/interfaces/social-column";
import { Edit, Eye, ImageMinus, Trash2 } from "lucide-react";
import SlugColumnBtn from "@/components/custom-btns/slug-column-btn";

// Colunas para Coluna Social
export const getSocialColumnsColumns = ({
  onView,
  onEdit,
  onDelete,
  onDeleteImg,
}: {
  onView: (item: ISocialColumn) => void;
  onEdit: (item: ISocialColumn) => void;
  onDelete: (item: ISocialColumn) => void;
  onDeleteImg: (item: ISocialColumn) => void;
}) => [
  {
    key: "title",
    title: "Título",
    render: (item: ISocialColumn) => (
      <span className="font-medium">{item.title}</span>
    ),
  },
  {
    key: "quantity",
    title: "Qtd de Imagens",
    render: (item: ISocialColumn) => {
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
    render: (item: ISocialColumn) => (
      <SlugColumnBtn slug={item.slug} url={`/coluna-social/${item.slug}`} />
    ),
  },
  {
    key: "actions",
    title: "Ações",
    className: "text-right",
    render: (item: ISocialColumn) => (
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
          onClick={() => onDeleteImg(item)}
        >
          <ImageMinus className="w-4 h-4" />
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
