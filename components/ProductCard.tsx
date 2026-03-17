import type { Offer } from "@/lib/types";

interface Props {
  offer: Offer;
}

export default function ProductCard({ offer }: Props) {
  const imageUrl =
    offer.produkt_bild_urls?.thumbnailUrl ||
    offer.imageURL ||
    null;

  const category =
    offer.product.categories[0]?.parent_category?.name ||
    offer.product.categories[0]?.name ||
    null;

  const validTo = offer.validTo
    ? new Date(offer.validTo * 1000).toLocaleDateString("en-SE", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative bg-gray-50 flex items-center justify-center h-32">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={offer.product.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="text-4xl select-none">🛒</div>
        )}
        {offer.discountPercent && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{offer.discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        {/* Brand + name */}
        {offer.product.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wide truncate">
            {offer.product.brand}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {offer.product.name || offer.article_matches}
        </h3>

        {/* Volume / description */}
        {(offer.volume || offer.description) && (
          <p className="text-xs text-gray-500 truncate">
            {offer.volume}
            {offer.volume && offer.description ? " · " : ""}
            {offer.description}
          </p>
        )}

        {/* Category */}
        {category && (
          <span className="inline-block w-fit text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-end justify-between mt-2 gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900">{offer.price}</p>
            {offer.regular && (
              <p className="text-xs text-gray-400 line-through">{offer.regular}</p>
            )}
            {offer.comprice && (
              <p className="text-xs text-gray-400">{offer.comprice}</p>
            )}
          </div>
          {offer.requiresMembershipCard && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full whitespace-nowrap">
              Members
            </span>
          )}
        </div>

        {/* Store + distance */}
        <div className="flex items-center gap-1 mt-1 pt-2 border-t border-gray-100">
          {offer.storeImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={offer.storeImageUrl} alt={offer.storeName} className="h-4 w-auto object-contain" />
          )}
          <span className="text-xs text-gray-500 truncate flex-1">{offer.storeName}</span>
          <span className="text-xs text-gray-400 whitespace-nowrap">{offer.distanceKm} km</span>
        </div>

        {validTo && (
          <p className="text-xs text-gray-400">Valid until {validTo}</p>
        )}
      </div>
    </div>
  );
}
