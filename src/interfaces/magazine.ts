import { IUser } from "./user";

export interface IMagazine {
  id: number;
  title: string;
  description: string;
  slug: string;
  file: File;
  image_url: File;
  user_id: number;
  user: IUser;
  created_at: string;
  updated_at: string;
}
