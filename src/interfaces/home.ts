import { IIndustrialGuide } from "./industrial-guide";
import { IMagazine } from "./magazine";
import { INews } from "./news";
import { ISocialColumn } from "./social-column";

export interface IHome {
  principais_noticias: INews[];
  social_columns: ISocialColumn[];
  magazines: IMagazine[];
  industrial_guides: IIndustrialGuide[];
  banners_home: Record<string, string[]>;
}
