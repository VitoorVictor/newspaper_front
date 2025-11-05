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
  link: string | null;
  banner_id: number | null;
  created_at: string;
  updated_at: string;
}
export interface IBannerTopSidePopUp {
  top: { url: string; link: string }[];
  "lateral industrial": { url: string; link: string }[];
  "lateral empresarial": { url: string; link: string }[];
  "lateral comercial": { url: string; link: string }[];
  "pop up": { url: string; link: string }[];
}
