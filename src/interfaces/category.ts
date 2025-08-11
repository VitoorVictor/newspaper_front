import { INews } from "./news";

export interface ICategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ICategoryWithNewsBanners extends ICategory {
  news: INews[];
  banners: string[];
}
