import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useBannerById,
  useCreateBanner,
  useDeleteBanner,
} from "@/hooks/tanstackQuery/useBanner";
import { useState } from "react";
import { CustomSelect } from "../custom-selects/custom-select";
import { IBanner, IBannerImage } from "@/interfaces/banner";
import { FileUpload } from "../file-upload";
import { CustomCarousel } from "../custom-carousel";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../confirm-dialog";
import { CustomFooterDialog } from "../custom-footer-dialog";

const bannerSchema = z.object({
  image_url: z.custom<File>((file) => file instanceof File && file.size > 0, {
    message: "Uma imagem válida é obrigatória",
  }),
  banner_id: z.number({ message: "Banner é obrigatório" }),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface ModalBannerProps {
  onOpenChange: (open: boolean) => void;
  banners: IBanner[];
  title: string;
  id?: number;
}
export const ModalBanner = ({
  onOpenChange,
  banners,
  title,
  id,
}: ModalBannerProps) => {
  const [selectedBanner, setSelectedBanner] = useState<{
    id: number;
    image_url: string;
  } | null>(null);
  const [showConfirmDeleteBanner, setShowConfirmDeleteBanner] = useState(false);
  const isUpdate = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
  });

  const { reset, handleSubmit, control } = form;
  const createBanner = useCreateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const { data: banner, isLoading } = useBannerById(id);

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url" && value instanceof File) {
        formData.append("image_url", value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    const res = isUpdate ? null : await createBanner.mutateAsync(formData);
    if (res) {
      reset();
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  const renderImageButtons = (
    id: number,
    image: {
      id: number;
      image_url: string;
    }
  ) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="destructive"
        className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 cursor-pointer"
        onClick={() => {
          setSelectedBanner(image);
          setShowConfirmDeleteBanner(true);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  const qdtImages = banner ? banner.data.banner_images.length : 0;

  return (
    <>
      <Dialog open={true} onOpenChange={() => onOpenChange(false)}>
        <DialogContent className="min-w-3xl">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {isUpdate
                ? "Visualize ou delete uma imagem."
                : "Insira o modelo e a imagem do banner."}
            </DialogDescription>
          </DialogHeader>
          {isUpdate && banner && (
            <div className="space-y-4">
              {qdtImages > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-md font-semibold">
                    Posição:{" "}
                    {banner.data.name === "top"
                      ? "Topo"
                      : banner.data.name === "side"
                      ? "Lateral"
                      : banner.data.name.charAt(0).toUpperCase() +
                        banner.data.name.slice(1)}
                  </h2>
                  <div className="flex justify-center">
                    <CustomCarousel
                      bannerImages={banner.data.banner_images}
                      direction={
                        banner.data.name === "side" ? "vertical" : "horizontal"
                      }
                      className="max-w-xl"
                      showControls={true}
                      renderCustomButton={renderImageButtons}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {qdtImages} imagem
                    {qdtImages !== 1 ? "s" : ""} encontrada
                    {qdtImages !== 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Nenhuma imagem encontrada para este banner
                  </p>
                </div>
              )}

              <DialogFooter className="flex-shrink-0 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}

          {!isUpdate && (
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full flex flex-col space-y-6"
              >
                {/* nome */}
                <CustomSelect
                  name="banner_id"
                  label="Modelo de Banner"
                  placeholder="Selecione o modelo do banner"
                  data={banners.map((banner) => {
                    return {
                      ...banner,
                      name:
                        banner.name === "top"
                          ? "Topo"
                          : banner.name === "side"
                          ? "Lateral"
                          : banner.name.charAt(0).toUpperCase() +
                            banner.name.slice(1),
                    };
                  })}
                  fieldValue="id"
                  fieldLabel="name"
                  required
                />

                {/* URL da Imagem */}
                <FormField
                  control={control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem *</FormLabel>
                      <FormControl>
                        <FileUpload
                          accept="image/*"
                          onFileSelect={(file) => {
                            field.onChange(file);
                          }}
                          placeholder="Arraste uma imagem ou clique para selecionar"
                          maxSize={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botões fixos na parte inferior */}
                <CustomFooterDialog
                  onOpenChange={() => onOpenChange(false)}
                  isSubmitting={isSubmitting}
                  isUpdate={isUpdate}
                  label="Banner"
                />
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={showConfirmDeleteBanner}
        onOpenChange={(open) => {
          setShowConfirmDeleteBanner(open);
          setSelectedBanner(null);
        }}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir está imagem?`}
        onConfirm={() => {
          if (selectedBanner) {
            deleteBannerMutation.mutate(selectedBanner.id);
          }
          setShowConfirmDeleteBanner(false);
          setSelectedBanner(null);
        }}
      />
    </>
  );
};
