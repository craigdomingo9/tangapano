import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoreState<T> {
  entities: T;
  setEntities: (entity: T) => void;
  reset: () => void;
}

interface StoreOptions {
  name?: string; // If provided, persistence is enabled
  skipHydration?: boolean; // Optional: useful for SSR apps
}

const createEntityStore = <T>(initialState: T, options?: StoreOptions) => {
  const stateInitializer: StateCreator<StoreState<T>> = (set) => ({
    entities: initialState,
    setEntities: (entities) => set({ entities }),
    reset: () => set({ entities: initialState }),
  });

  // Conditional Logic: To Persist or Not to Persist?
  if (options?.name) {
    return create<StoreState<T>>()(
      persist(stateInitializer, {
        name: options.name, // Unique key for localStorage
        storage: createJSONStorage(() => localStorage),
        skipHydration: options.skipHydration,
      })
    );
  }

  // Default: In-memory store only
  return create<StoreState<T>>()(stateInitializer);
};

export default createEntityStore;
