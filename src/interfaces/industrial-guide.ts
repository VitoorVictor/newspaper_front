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
  created_at: string;
  updated_at: string;
}

export interface IIndustrialGuideWithUsersSectors extends IIndustrialGuide {
  user: IUser;
  sectors: ISector[];
}
