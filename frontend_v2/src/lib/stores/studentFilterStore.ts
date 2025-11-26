import createEntityStore from "./entityStore";

export interface StudentFilters {
  campus: string | null;
  neighborhood: string | null;
  selectedPerks: string[];
  minPrice: number | null;
  maxPrice: number | null;
  roommates: number | null;
  gender: "female" | "male";
}

const useStudentFilters = createEntityStore<StudentFilters>({
  campus: null,
  neighborhood: null,
  selectedPerks: [],
  minPrice: 60,
  maxPrice: 150,
  roommates: 1,
  gender: "female",
});

export default useStudentFilters;
