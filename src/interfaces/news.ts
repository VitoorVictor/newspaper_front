export interface INews {
  id: number;
  title: string;
  sub_title: string;
  content: string;
  image_url: File;
  badge: string;
  user_id: string;
  top_position: boolean;
  status: "draft" | "published";
  category_ids: number[];
}
