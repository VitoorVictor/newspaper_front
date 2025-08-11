import { INews } from "./news";

export interface ICategory {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ICategoryWithNewsBanners extends ICategory {
  news: INews[];
  banners: string[];
}
