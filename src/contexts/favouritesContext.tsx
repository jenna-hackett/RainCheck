import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type FavouriteLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type FavouritesContextType = {
  favourites: FavouriteLocation[];
  addFavourite: (loc: FavouriteLocation) => void;
  removeFavourite: (city: string, country: string) => void;
  isFavourite: (city: string, country: string) => boolean;
};

export const FavouritesContext = createContext<FavouritesContextType | null>(
  null,
);

export function FavouritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favourites, setFavourites] = useState<FavouriteLocation[]>([]);

  // Load favourites on startup
  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem("favourites");
        if (saved) {
          setFavourites(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Failed to load favourites:", err);
      }
    }
    load();
  }, []);

  // Save whenever favourites change
  useEffect(() => {
    AsyncStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Add a favourite
  const addFavourite = (loc: FavouriteLocation) => {
    setFavourites((prev) => {
      if (prev.some((f) => f.city === loc.city)) return prev; // avoid duplicates
      return [...prev, loc];
    });
  };

  // Remove a favourite
  const removeFavourite = (city: string, country: string) => {
    setFavourites((prev) =>
      prev.filter((f) => !(f.city === city && f.country === country)),
    );
  };

  // Check if favourite
  const isFavourite = (city: string, country: string) => {
    return favourites.some((f) => f.city === city && f.country === country);
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
