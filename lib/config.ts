// ─── Search Configuration ────────────────────────────────────────────────────
// Change SEARCH_RADIUS_KM to control how far (in kilometres) we look for stores
export const SEARCH_RADIUS_KM = 10;

// Max number of offers to fetch per store (matpriskollen supports up to ~200)
export const OFFERS_LIMIT_PER_STORE = 100;

// Base URL of the upstream matpriskollen API
export const UPSTREAM_BASE = "https://matpriskollen.se";

// Categories (Swedish → English label)
export const CATEGORIES: Record<string, string> = {
  barnprodukter: "Baby Products",
  "brod-kakor": "Bread & Cookies",
  charkdelikatess: "Deli",
  dessertmellanmal: "Dessert / Snacks",
  djur: "Pet",
  drycker: "Drinks",
  ekologiskt: "Organic",
  "fisk-skaldjur": "Fish & Seafood",
  "frukt-bar": "Fruit & Berries",
  fardigmat: "Ready Meals",
  glass: "Ice Cream",
  gronsaker: "Vegetables",
  "hem-hushall": "Home & Household",
  hygien: "Hygiene",
  halsa: "Health",
  "korv-palagg": "Sausage & Cold Cuts",
  kroppsvard: "Body Care",
  kott: "Meat",
  mejeri: "Dairy",
  ost: "Cheese",
  "serverad-mat": "Served Food",
  skafferi: "Pantry",
  "snacks-godis": "Snacks & Candy",
  tobak: "Tobacco",
  vegetariskt: "Vegetarian",
};
