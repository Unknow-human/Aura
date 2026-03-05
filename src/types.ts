export type ProductType = 'domotique' | 'industrie' | 'electronique';

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  type: ProductType;
  image: string;
  poster?: string;
  features: string[];
  benefits: string[];
  price?: string;
  sort_order?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
