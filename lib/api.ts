import { SEARCH_RADIUS_KM, OFFERS_LIMIT_PER_STORE } from "./config";
import type { Store, StoreOffersResponse, Offer } from "./types";

/** Parse Swedish price string like "39,90/frp" → number 39.90, or null */
function parsePrice(raw: string): number | null {
  if (!raw) return null;
  const match = raw.match(/^([\d\s]+[,.][\d]+)/);
  if (!match) return null;
  return parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
}

/** Calculate discount % given a sale price and regular price string */
export function calcDiscount(price: string, regular: string): number | null {
  const sale = parsePrice(price);
  const orig = parsePrice(regular);
  if (!sale || !orig || orig <= sale) return null;
  return Math.round(((orig - sale) / orig) * 100);
}

/** Fetch nearby stores within SEARCH_RADIUS_KM */
export async function fetchNearbyStores(lat: number, lon: number): Promise<Store[]> {
  const url = `/productprice/api/proxy/v1/stores?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Stores API error: ${res.status}`);
  const all: Store[] = await res.json();
  return all.filter((s) => parseFloat(s.dist) <= SEARCH_RADIUS_KM);
}

/** Fetch all offers for a single store */
export async function fetchStoreOffers(
  storeKey: string,
  lat: number,
  lon: number,
  storeName: string,
  storeImageUrl: string,
  distanceKm: string
): Promise<Offer[]> {
  const url = `/productprice/api/proxy/v1/stores/${storeKey}/offers?lat=${lat}&lon=${lon}&limit=${OFFERS_LIMIT_PER_STORE}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data: StoreOffersResponse = await res.json();
  return data.offers.map((offer) => ({
    ...offer,
    storeName,
    storeImageUrl,
    distanceKm,
    discountPercent: calcDiscount(offer.price, offer.regular),
  }));
}

/** Fetch offers from all nearby stores in parallel */
export async function fetchAllNearbyOffers(lat: number, lon: number): Promise<{
  stores: Store[];
  offers: Offer[];
}> {
  const stores = await fetchNearbyStores(lat, lon);
  const results = await Promise.allSettled(
    stores.map((s) =>
      fetchStoreOffers(s.key, lat, lon, s.name, s.imageUrl, s.dist)
    )
  );
  const offers = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return { stores, offers };
}
