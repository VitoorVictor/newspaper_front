import { ISector } from "./sector";
import { IMagazine } from "./magazine";
import { INews } from "./news";
import { ISocialColumn } from "./social-column";

export interface IHome {
  principais_noticias: INews[];
  social_columns: ISocialColumn[];
  magazines: IMagazine[];
  sectors: ISector[];
  banners_home: Record<string, string[]>;
}
