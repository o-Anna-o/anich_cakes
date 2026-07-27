export interface CardData {
  name: string;
  category: string;
  page: string;
  images: string[];
  calories: string;
  description: string;
  content?: string;
  filters?: string[];
}

export interface CategoryInfo {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  breadcrumb: string;
  pageClass?: string;
  thematical?: boolean;
}
