import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GeocodeResult } from "../api/geocodeApi";

type FavouritesContextType = {
  favourites: GeocodeResult[];
  addFavourite: (location: GeocodeResult) => void;
  removeFavourite: (latitude: number, longitude: number) => void;
  isFavourite: (latitude: number, longitude: number) => boolean;
};

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export function FavouritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favourites, setFavourites] = useState<GeocodeResult[]>([]);

  useEffect(() => {
    async function loadFavourites() {
      try {
        const saved = await AsyncStorage.getItem("favourites");
        if (saved) setFavourites(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load favourites:", error);
      }
    }
    loadFavourites();
  }, []);

  function saveFavourites(updated: GeocodeResult[]) {
    setFavourites(updated);
    AsyncStorage.setItem("favourites", JSON.stringify(updated));
  }

  function addFavourite(location: GeocodeResult) {
    if (isFavourite(location.latitude, location.longitude)) return;
    saveFavourites([...favourites, location]);
  }

  function removeFavourite(latitude: number, longitude: number) {
    saveFavourites(
      favourites.filter(
        (f) => f.latitude !== latitude || f.longitude !== longitude,
      ),
    );
  }

  function isFavourite(latitude: number, longitude: number) {
    return favourites.some(
      (f) => f.latitude === latitude && f.longitude === longitude,
    );
  }

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context)
    throw new Error("useFavourites must be used within FavouritesProvider");
  return context;
}
