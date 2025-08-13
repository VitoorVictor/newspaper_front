import { ICategory } from "./category";

export interface INews {
  id: number;
  title: string;
  sub_title: string;
  content: string;
  image_url: File;
  badge: string;
  user_id: string;
  user: any;
  slug:string
  top_position: string;
  status: "draft" | "published";
  category_ids: number[];
  categories: ICategory[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
