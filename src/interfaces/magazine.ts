export interface IMagazine {
  id: number;
  title: string;
  description: string;
  slug: string;
  file: File;
  image_url: File;
  user_id: number;
  created_at: string;
  updated_at: string;
}