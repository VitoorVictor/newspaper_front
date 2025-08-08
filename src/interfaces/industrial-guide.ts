export interface IIndustrialGuide {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  image_url: File;
  address: string;
  number: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}
