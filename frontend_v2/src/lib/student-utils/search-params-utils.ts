import { StudentFilters } from "../stores/studentFilterStore";

export function parseSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): StudentFilters & { page: number } {
  // --- Helper 1: Handle Numbers (Price, Roommates) ---
  const parseNumber = (val: string | string[] | undefined): number | null => {
    if (typeof val === "string") {
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  };

  // --- Helper 2: Handle Arrays (Perks) ---
  // Next.js returns a string if one checkbox is selected,
  // and an array of strings if multiple are selected.
  const parseArray = (val: string | string[] | undefined): string[] => {
    if (typeof val === "string") return [val];
    if (Array.isArray(val)) return val;
    return [];
  };

  // --- Helper 3: Handle Single Strings (Campus, Neighborhood) ---
  // We usually take the first value if someone somehow sends an array
  const parseString = (val: string | string[] | undefined): string => {
    if (typeof val === "string") return val;
    if (Array.isArray(val) && val.length > 0) return val[0];
    return ""; // Default to empty string
  };

  return {
    // 1. Explicitly map every field. Do not use ...params
    campus: parseString(params.campus),
    neighborhood: parseString(params.neighborhood),

    // 2. Correctly map specific keys to their logic
    selectedPerks: parseArray(params.amenities), // assuming URL is ?perks=wifi

    minPrice: parseNumber(params.price_min),
    maxPrice: parseNumber(params.price_max),
    roommates: parseNumber(params.max_occupants),

    gender: params.gender as "male" | "female",

    page: parseNumber(params.page) || 1,
  };
}

export function hasExpressParams(params: {
  [key: string]: string | string[] | undefined;
}): boolean {
  return params.expressInterest === "true" && params.listing !== undefined;
}

export function hasActiveFilters(filters: StudentFilters): boolean {
  return (
    !!filters.campus ||
    !!filters.neighborhood ||
    filters.selectedPerks.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.roommates !== null ||
    !!filters.gender
  );
}

export function hasNoParams(params: {
  [key: string]: string | string[] | undefined;
}): boolean {
  // Check if params object is empty or has no meaningful values
  const keys = Object.keys(params);

  if (keys.length === 0) return true;

  // Check if all values are empty/undefined
  return keys.every((key) => {
    const value = params[key];
    return (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  });
}
