import { IIndustrialGuide } from "./industrial-guide";
import { INews } from "./news";
import { ISocialColumn } from "./social-column";

export interface IHome {
  news: INews[];
  social_columns: ISocialColumn[];
  magazines: any;
  industrial_guides: IIndustrialGuide[];
}
