export const PSO_FUEL_PRICES_URL = "https://psopk.com/en/fuels/fuel-prices";

export type FuelPriceKey = "petrol" | "octane" | "diesel";

export type FuelPriceBoard = {
  petrol: number;
  octane: number;
  diesel: number;
  effective: string | null;
  effectiveLabel: string;
  source: "pso" | "cache" | "override" | "fallback";
  sourceUrl: string;
  fetchedAt: string;
};

const PRODUCTS: { key: FuelPriceKey; title: string; hint: string; icon: string }[] = [
  { key: "petrol", title: "Petrol", hint: "PSO Premier Euro 5", icon: "/assets/icons/drop.svg" },
  { key: "octane", title: "Hi-Octane", hint: "PSO Gujranwala", icon: "/assets/icons/gauge.svg" },
  { key: "diesel", title: "Diesel", hint: "HSD Euro 5", icon: "/assets/icons/pump.svg" },
];

export function fuelPriceCards(board: FuelPriceBoard) {
  return PRODUCTS.map((item) => ({
    ...item,
    rate: board[item.key],
  }));
}

export function formatPkr(rate: number) {
  const fraction = Number.isInteger(rate) ? 0 : 2;
  return rate.toLocaleString("en-PK", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: 2,
  });
}
