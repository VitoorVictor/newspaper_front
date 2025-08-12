export interface IBanner {
  id: number;
  name: string;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  banner_images: IBannerImage[];
}

export interface IBannerImage {
  id: number;
  image_url: string;
  banner_id: number | null;
  created_at: string;
  updated_at: string;
}
