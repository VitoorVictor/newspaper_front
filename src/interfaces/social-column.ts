export interface ISocialColumns {
  id: number;
  title: string;
  slug: string;
  hours: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  images: {
    id: number;
    image_url: string;
    is_cover: number;
    created_at: string;
  }[];
}
