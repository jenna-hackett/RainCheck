import { router } from "expo-router";
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
import { weatherThemes } from "../../src/theme/theme";
import { formatTemp } from "../../src/utils/formatTemperature";

type SearchResult = GeocodeResult & { temp?: number };

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [favWeather, setFavWeather] = useState<Record<string, number>>({});

  const { unit, weatherCondition, setSelectedLocation } = useSettings();
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavourites();

  const theme = weatherThemes[weatherCondition];

  useEffect(() => {
    const fetchFavWeather = async () => {
      const weatherMap: Record<string, number> = {};
      await Promise.all(
        favourites.map(async (fav) => {
          const data = await getWeather(fav.latitude, fav.longitude, unit);
          if (data) {
            weatherMap[`${fav.latitude}-${fav.longitude}`] =
              data.current.temperature;
          }
        }),
      );
      setFavWeather(weatherMap);
    };

    if (favourites.length > 0) fetchFavWeather();
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

  const handleSelectLocation = (item: GeocodeResult) => {
    setSelectedLocation(item);
    router.push("/(tabs)");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.searchBar}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
              backgroundColor: theme.cardBackground,
            },
          ]}
          placeholderTextColor={theme.subtext}
          placeholder="Search for a city..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (text === "") setSearchResults([]);
          }}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={handleSearch}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.text}
          style={{ marginVertical: 10 }}
        />
      )}

      {searchResults.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Search Results
          </Text>
          {searchResults.map((item, index) => {
            const isAdded = isFavourite(item.latitude, item.longitude);
            return (
              <TouchableOpacity
                key={`search-${index}`}
                style={[styles.resultItem, { borderBottomColor: theme.border }]}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.info}>
                  <Text style={[styles.cityName, { color: theme.text }]}>
                    {item.city}, {item.country}
                  </Text>
                  <Text style={[styles.temp, { color: theme.subtext }]}>
                    {item.temp !== undefined
                      ? formatTemp(item.temp, unit)
                      : "--"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    isAdded
                      ? removeFavourite(item.latitude, item.longitude)
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
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          My Weather Locations
        </Text>
        {favourites.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            No saved locations yet.
          </Text>
        ) : (
          favourites.map((item, index) => {
            const tempKey = `${item.latitude}-${item.longitude}`;
            const currentTemp = favWeather[tempKey];
            return (
              <TouchableOpacity
                key={`fav-${index}`}
                style={[styles.resultItem, { borderBottomColor: theme.border }]}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.info}>
                  <Text style={[styles.cityName, { color: theme.text }]}>
                    {item.city}, {item.country}
                  </Text>
                  <Text style={[styles.temp, { color: theme.subtext }]}>
                    {currentTemp !== undefined
                      ? formatTemp(currentTemp, unit)
                      : "Loading..."}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFavourite(item.latitude, item.longitude)}
                  style={styles.favButton}
                >
                  <Text style={[styles.symbol, { color: "#FF3B30" }]}>–</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginLeft: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
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
    marginTop: 2,
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
    fontStyle: "italic",
  },
});
