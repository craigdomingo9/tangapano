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

  // --- Helper 4: Handle Nullable Strings (Gender) ---
  const parseNullableString = (
    val: string | string[] | undefined
  ): string | null => {
    if (typeof val === "string") return val;
    if (Array.isArray(val) && val.length > 0) return val[0];
    return null;
  };

  return {
    // 1. Explicitly map every field. Do not use ...params
    campus: parseString(params.campus),
    neighborhood: parseString(params.neighborhood),

    // 2. Correctly map specific keys to their logic
    selectedPerks: parseArray(params.perks), // assuming URL is ?perks=wifi

    minPrice: parseNumber(params.min),
    maxPrice: parseNumber(params.max),
    roommates: parseNumber(params.roommates),

    gender: parseNullableString(params.gender),

    page: parseNumber(params.page) || 1,
  };
}
