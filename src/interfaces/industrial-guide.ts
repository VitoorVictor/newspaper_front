import { ISector } from "./sector";
import { IUser } from "./user";

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
  facebook_url?: string;
  instagram_url?: string;
  website_url?: string;
  linkedin_url?: string;
  whatsapp?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface IIndustrialGuideWithUsersSectors extends IIndustrialGuide {
  user: IUser;
  sectors: ISector[];
}
