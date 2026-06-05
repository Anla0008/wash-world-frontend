import { create } from "zustand";

type FavoritesStore = {
  favoriteIds: Set<string>; // unikke favorit-ids ("Set" forhindrer gentagelser)
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favoriteIds: new Set(), // starter tom

  setFavorites: (ids) => set({ favoriteIds: new Set(ids) }), // sæt alle favoritter på én gang

  addFavorite: (id) => set((state) => ({ favoriteIds: new Set(state.favoriteIds).add(id) })), // tilføj én

  removeFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoriteIds);
      next.delete(id); // fjern én
      return { favoriteIds: next };
    }),
}));
