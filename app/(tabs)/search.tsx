import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { geocodeCity, GeocodeResult } from "../../src/api/geocodeApi";
import { getWeather } from "../../src/api/weatherApi";
import { useFavourites } from "../../src/contexts/favouritesContext";
import { useSettings } from "../../src/contexts/settingsContext";
import { formatTemp } from "../../src/utils/formatTemperature";

type SearchResult = GeocodeResult & { temp?: number };

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // New state to hold weather for the "My Locations" section
  const [favWeather, setFavWeather] = useState<Record<string, number>>({});

  const { unit } = useSettings()!;
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavourites()!;

  // Fetch weather for favourites whenever the favourites list or unit changes
  useEffect(() => {
    const fetchFavWeather = async () => {
      const weatherMap: Record<string, number> = {};

      await Promise.all(
        favourites.map(async (fav) => {
          const data = await getWeather(fav.latitude, fav.longitude, unit);
          if (data) {
            // We use a key of city+country to match our uniqueness logic
            weatherMap[`${fav.city}-${fav.country}`] = data.current.temperature;
          }
        }),
      );
      setFavWeather(weatherMap);
    };

    if (favourites.length > 0) {
      fetchFavWeather();
    }
  }, [favourites, unit]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const locations = await geocodeCity(query);
    if (locations) {
      const resultsWithWeather = await Promise.all(
        locations.map(async (loc) => {
          const weather = await getWeather(loc.latitude, loc.longitude, unit);
          return { ...loc, temp: weather?.current.temperature };
        }),
      );
      setSearchResults(resultsWithWeather);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text === "") setSearchResults([]);
          }}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results Section */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginVertical: 10 }}
        />
      )}

      {searchResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {searchResults.map((item, index) => {
            const isAdded = isFavourite(item.city, item.country);
            return (
              <View key={`search-${index}`} style={styles.resultItem}>
                <View style={styles.info}>
                  <Text style={styles.cityName}>
                    {item.city}, {item.country}
                  </Text>
                  <Text style={styles.temp}>
                    {item.temp !== undefined
                      ? formatTemp(item.temp, unit)
                      : "--"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    isAdded
                      ? removeFavourite(item.city, item.country)
                      : addFavourite(item)
                  }
                  style={styles.favButton}
                >
                  <Text
                    style={[
                      styles.symbol,
                      { color: isAdded ? "#FF3B30" : "#4CD964" },
                    ]}
                  >
                    {isAdded ? "–" : "+"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* My Weather Locations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Weather Locations</Text>
        {favourites.length === 0 ? (
          <Text style={styles.emptyText}>No saved locations yet.</Text>
        ) : (
          favourites.map((item, index) => {
            const tempKey = `${item.city}-${item.country}`;
            const currentTemp = favWeather[tempKey];

            return (
              <View key={`fav-${index}`} style={styles.resultItem}>
                <View style={styles.info}>
                  <Text style={styles.cityName}>
                    {item.city}, {item.country}
                  </Text>
                  <Text style={styles.temp}>
                    {currentTemp !== undefined
                      ? formatTemp(currentTemp, unit)
                      : "Loading..."}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFavourite(item.city, item.country)}
                  style={styles.favButton}
                >
                  <Text style={[styles.symbol, { color: "#FF3B30" }]}>–</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  resultItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
  },
  temp: {
    fontSize: 14,
    color: "#666",
  },
  favButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    fontSize: 35,
    fontWeight: "bold",
    lineHeight: 40,
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
});
