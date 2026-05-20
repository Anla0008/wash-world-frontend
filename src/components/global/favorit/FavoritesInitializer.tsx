"use client";

import { useEffect } from "react";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuth } from "@/hooks/useAuth";

export function FavoritesInitializer() {
  const { getFavorites } = useAuth();
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  useEffect(() => {
    getFavorites()
      .then((favs) => setFavorites(favs.map((f: any) => f.location_pk)))
      .catch(() => {});
  }, []);

  return null;
}
