"use client";

import { useState, useMemo } from "react";
import LocationForm from "@/components/LocationForm";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import ProductCard from "@/components/ProductCard";
import type { Offer, Store } from "@/lib/types";
import { SEARCH_RADIUS_KM, UPSTREAM_BASE, OFFERS_LIMIT_PER_STORE } from "@/lib/config";
import { calcDiscount } from "@/lib/api";

async function fetchNearbyStores(lat: number, lon: number): Promise<Store[]> {
  const res = await fetch(`${UPSTREAM_BASE}/api/v1/stores?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error(`Stores fetch failed: ${res.status}`);
  const all: Store[] = await res.json();
  return all.filter((s) => parseFloat(s.dist) <= SEARCH_RADIUS_KM);
}

async function fetchStoreOffers(
  store: Store,
  lat: number,
  lon: number
): Promise<Offer[]> {
  const url = `${UPSTREAM_BASE}/api/v1/stores/${store.key}/offers?lat=${lat}&lon=${lon}&limit=${OFFERS_LIMIT_PER_STORE}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.offers ?? []).map((offer: Offer) => ({
    ...offer,
    storeName: store.name,
    storeImageUrl: store.imageUrl,
    distanceKm: store.dist,
    discountPercent: calcDiscount(offer.price, offer.regular),
  }));
}

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "discount" | "name">("distance");

  async function handleSearch(lat: number, lon: number) {
    setLoading(true);
    setError("");
    setSearched(false);
    setQuery("");
    setSelectedStore("");

    try {
      const nearbyStores = await fetchNearbyStores(lat, lon);
      setStores(nearbyStores);

      const results = await Promise.allSettled(
        nearbyStores.map((s) => fetchStoreOffers(s, lat, lon))
      );
      const allOffers = results.flatMap((r) =>
        r.status === "fulfilled" ? r.value : []
      );
      setOffers(allOffers);
      setSearched(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const filteredOffers = useMemo(() => {
    let result = offers;

    if (selectedStore) {
      result = result.filter((o) => o.store_key === selectedStore);
    }

    if (onlyDiscounts) {
      result = result.filter((o) => o.discountPercent && o.discountPercent > 0);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((o) => {
        const name = (o.product.name || "").toLowerCase();
        const brand = (o.product.brand || "").toLowerCase();
        const matches = (o.article_matches || "").toLowerCase();
        const cat = o.product.categories.map((c) => c.name.toLowerCase()).join(" ");
        const store = (o.storeName || "").toLowerCase();
        return (
          name.includes(q) ||
          brand.includes(q) ||
          matches.includes(q) ||
          cat.includes(q) ||
          store.includes(q)
        );
      });
    }

    if (sortBy === "discount") {
      result = [...result].sort(
        (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0)
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        (a.product.name || "").localeCompare(b.product.name || "")
      );
    } else {
      result = [...result].sort(
        (a, b) => parseFloat(a.distanceKm ?? "0") - parseFloat(b.distanceKm ?? "0")
      );
    }

    return result;
  }, [offers, query, selectedStore, onlyDiscounts, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            🛒 Grocery Price Finder
          </h1>
          <p className="text-sm text-gray-500">
            Find the best grocery deals from stores within{" "}
            <strong>{SEARCH_RADIUS_KM} km</strong> of your location
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Your Location</h2>
          <LocationForm onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {searched && !loading && (
          <>
            <div className="flex flex-wrap gap-2">
              {stores.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600"
                >
                  {s.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.imageUrl} alt={s.name} className="h-4 w-auto object-contain" />
                  )}
                  <span className="font-medium">{s.name}</span>
                  <span className="text-gray-400">{s.dist} km · {s.offerCount} offers</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <SearchBar
                value={query}
                onChange={setQuery}
                resultCount={filteredOffers.length}
                totalCount={offers.length}
              />
              <Filters
                stores={stores}
                selectedStore={selectedStore}
                onStoreChange={setSelectedStore}
                onlyDiscounts={onlyDiscounts}
                onOnlyDiscountsChange={setOnlyDiscounts}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {filteredOffers.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-medium">No products found</p>
                <p className="text-sm">Try a different search or adjust filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredOffers.map((offer) => (
                  <ProductCard key={`${offer.store_key}-${offer.id}`} offer={offer} />
                ))}
              </div>
            )}
          </>
        )}

        {!searched && !loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📍</p>
            <p className="font-medium text-gray-600">
              Enter your location to find nearby grocery deals
            </p>
            <p className="text-sm mt-1">
              We&apos;ll search stores within {SEARCH_RADIUS_KM} km and show all current
              offers with prices and discounts
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4 animate-bounce">🛒</p>
            <p className="font-medium text-gray-600">
              Fetching offers from nearby stores…
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
