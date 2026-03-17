export interface Store {
  id: number;
  key: string;
  name: string;
  offerCount: number;
  imageUrl: string;
  dist: string; // distance in km as string e.g. "3.20"
  lon: number;
  lat: number;
  premium: boolean;
}

export interface ProductImage {
  produktKey: string;
  bildUrl: string;
  thumbnailUrl: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  parent_category: {
    id: number;
    name: string;
  } | null;
}

export interface Product {
  id: number;
  name: string;
  origin: string;
  categories: ProductCategory[];
  tags: string[];
  brand: string;
}

export interface Offer {
  id: number;
  key: string;
  description: string;
  price: string;
  comprice: string; // comparison price e.g. "56,51/kg"
  regular: string; // original price before discount
  volume: string;
  pant: boolean; // deposit (Swedish: pant)
  requiresMembershipCard: boolean;
  imageURL: string;
  validFrom: number; // unix timestamp
  validTo: number; // unix timestamp
  featured: boolean;
  store_id: number;
  store_key: string;
  product: Product;
  produkt_bild_urls: ProductImage | null;
  article_matches: string;
  hasRecipe: boolean;
  // enriched client-side
  storeName?: string;
  storeImageUrl?: string;
  distanceKm?: string;
  discountPercent?: number | null;
}

export interface StoreOffersResponse {
  storeName: string;
  offers: Offer[];
}
