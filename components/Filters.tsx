"use client";

import type { Store } from "@/lib/types";

interface Props {
  stores: Store[];
  selectedStore: string;
  onStoreChange: (key: string) => void;
  onlyDiscounts: boolean;
  onOnlyDiscountsChange: (v: boolean) => void;
  sortBy: "distance" | "discount" | "name";
  onSortChange: (v: "distance" | "discount" | "name") => void;
}

export default function Filters({
  stores,
  selectedStore,
  onStoreChange,
  onlyDiscounts,
  onOnlyDiscountsChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Store filter */}
      <select
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All stores ({stores.length})</option>
        {stores.map((s) => (
          <option key={s.key} value={s.key}>
            {s.name} · {s.dist} km
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "distance" | "discount" | "name")}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="distance">Sort: Distance</option>
        <option value="discount">Sort: Best discount</option>
        <option value="name">Sort: Name A–Z</option>
      </select>

      {/* Discounts only toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
        <input
          type="checkbox"
          checked={onlyDiscounts}
          onChange={(e) => onOnlyDiscountsChange(e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        Discounted only
      </label>
    </div>
  );
}
