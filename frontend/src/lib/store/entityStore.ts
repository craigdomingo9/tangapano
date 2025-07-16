import { create } from "zustand";


interface StoreState<T> {
  entities: T;
  setEntities: (entity: T) => void;
}


const createEntityStore = <T>(initialState: T) => {
  const useEntityStore = create<StoreState<T>>(
    (set) => ({
      entities: initialState,
      setEntities: (entities) => set({ entities }),
    })
  );

  return useEntityStore;
};




export default createEntityStore
