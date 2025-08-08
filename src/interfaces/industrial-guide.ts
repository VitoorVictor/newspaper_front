import { ISector } from "./sector";

export interface IIndustrialGuide {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  image_url: File;
  address: string;
  number: string;
  description: string;
  sector_ids: number[];
  sectors: ISector[];
  created_at: string | null;
  updated_at: string | null;
}
