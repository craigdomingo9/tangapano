import { useMemo } from "react";

export function usePriceRange(rooms: any[]) {
  return useMemo(() => {
    if (!rooms || rooms.length === 0) return { min: 0, max: 0 };
    const rents = rooms.map((r: any) => parseFloat(r.rent_per_month));
    return { min: Math.min(...rents), max: Math.max(...rents) };
  }, [rooms]);
}
