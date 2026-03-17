"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({ value, onChange, resultCount, totalCount }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 max-w-lg">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products, brands, categories…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
      <p className="text-sm text-gray-500 whitespace-nowrap">
        {resultCount} of {totalCount} products
      </p>
    </div>
  );
}
