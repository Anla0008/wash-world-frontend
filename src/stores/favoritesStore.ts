import { create } from "zustand";

type FavoritesStore = {
  favoriteIds: Set<string>;
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favoriteIds: new Set(),

  setFavorites: (ids) => set({ favoriteIds: new Set(ids) }),

  addFavorite: (id) => set((state) => ({ favoriteIds: new Set(state.favoriteIds).add(id) })),

  removeFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoriteIds);
      next.delete(id);
      return { favoriteIds: next };
    }),
}));
