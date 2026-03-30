import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { geocodeCity, GeocodeResult } from "../../src/api/geocodeApi";
import { getWeather, WeatherData } from "../../src/api/weatherApi";
import { useFavourites } from "../../src/contexts/favouritesContext";
import { useSettings } from "../../src/contexts/settingsContext";
import { weatherThemes } from "../../src/theme/theme";
import { formatTemp } from "../../src/utils/formatTemperature";
import { getWeatherIcon } from "../../src/utils/weatherHelpers";

type SearchResult = GeocodeResult & { temp?: number };
type FavWeatherData = { temp: number; weatherCode: number; isDay: number };

const MAX_RECENTS = 3;

function formatLocation(location: GeocodeResult): string {
  if (location.admin1) {
    return `${location.city}, ${location.admin1}, ${location.country}`;
  }
  if (location.country) return `${location.city}, ${location.country}`;
  return location.city;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [favWeather, setFavWeather] = useState<Record<string, FavWeatherData>>(
    {},
  );
  const [gpsWeather, setGpsWeather] = useState<WeatherData | null>(null);
  const [recents, setRecents] = useState<GeocodeResult[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const {
    unit,
    weatherCondition,
    setSelectedLocation,
    isGPSLocation,
    gpsLocation,
  } = useSettings();
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavourites();

  const theme = weatherThemes[weatherCondition];

  useEffect(() => {
    async function fetchGPSWeather() {
      if (!isGPSLocation || !gpsLocation) return;
      const data = await getWeather(
        gpsLocation.latitude,
        gpsLocation.longitude,
        unit,
      );
      if (data) setGpsWeather(data);
    }
    fetchGPSWeather();
  }, [isGPSLocation, gpsLocation, unit]);

  useEffect(() => {
    const fetchFavWeather = async () => {
      const weatherMap: Record<string, FavWeatherData> = {};
      await Promise.all(
        favourites.map(async (fav) => {
          const data = await getWeather(fav.latitude, fav.longitude, unit);
          if (data) {
            weatherMap[`${fav.latitude}-${fav.longitude}`] = {
              temp: data.current.temperature,
              weatherCode: data.current.weatherCode,
              isDay: data.current.isDay,
            };
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
    setRecents((prev) => {
      const filtered = prev.filter(
        (r) => r.latitude !== item.latitude || r.longitude !== item.longitude,
      );
      return [item, ...filtered].slice(0, MAX_RECENTS);
    });
    router.push("/(tabs)");
  };

  const removeRecent = (item: GeocodeResult) => {
    setRecents((prev) =>
      prev.filter(
        (r) => r.latitude !== item.latitude || r.longitude !== item.longitude,
      ),
    );
  };

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text }]}>Search</Text>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={theme.subtext}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholderTextColor={theme.subtext}
              placeholder="Search for a city..."
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (text === "") setSearchResults([]);
              }}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => {
                  setQuery("");
                  setSearchResults([]);
                }}
              >
                <Ionicons name="close-circle" size={18} color={theme.subtext} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[
              styles.searchButton,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
            onPress={handleSearch}
          >
            <Text style={[styles.searchButtonText, { color: theme.text }]}>
              Search
            </Text>
          </Pressable>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.subtext}
            style={{ marginVertical: 24 }}
          />
        )}

        {/* Search results */}
        {searchResults.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Results
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              {searchResults.map((item, index) => {
                const isAdded = isFavourite(item.latitude, item.longitude);
                return (
                  <View key={`search-${index}`}>
                    <Pressable
                      style={styles.resultRow}
                      onPress={() => handleSelectLocation(item)}
                    >
                      <View style={styles.resultInfo}>
                        <Text style={[styles.cityName, { color: theme.text }]}>
                          {formatLocation(item)}
                        </Text>
                        <Text style={[styles.temp, { color: theme.subtext }]}>
                          {item.temp !== undefined
                            ? formatTemp(item.temp, unit)
                            : "--"}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() =>
                          isAdded
                            ? removeFavourite(item.latitude, item.longitude)
                            : addFavourite(item)
                        }
                        style={styles.actionButton}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={isAdded ? "heart" : "heart-outline"}
                          size={22}
                          color={isAdded ? "#FF3B30" : theme.subtext}
                        />
                      </Pressable>
                    </Pressable>
                    {index < searchResults.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: theme.border },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* GPS current location hero card */}
        {isGPSLocation && gpsLocation && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Current Location
            </Text>
            <Pressable
              style={[
                styles.currentCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => {
                setSelectedLocation(gpsLocation);
                router.push("/(tabs)");
              }}
            >
              <View style={styles.currentCardContent}>
                <View style={styles.currentCardLeft}>
                  <View style={styles.currentLabelRow}>
                    <Ionicons name="navigate" size={12} color={theme.subtext} />
                    <Text
                      style={[styles.currentLabel, { color: theme.subtext }]}
                    >
                      {formatLocation(gpsLocation)}
                    </Text>
                  </View>
                  <Text style={[styles.currentTemp, { color: theme.text }]}>
                    {gpsWeather
                      ? formatTemp(
                          Math.round(gpsWeather.current.temperature),
                          unit,
                        )
                      : "--"}
                  </Text>
                </View>
                <Ionicons
                  name={
                    gpsWeather
                      ? (getWeatherIcon(
                          gpsWeather.current.weatherCode,
                          gpsWeather.current.isDay,
                        ) as any)
                      : "cloud-outline"
                  }
                  size={72}
                  color={theme.text}
                  style={{ opacity: 0.85 }}
                />
              </View>
            </Pressable>
          </>
        )}

        {/* Favourites */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Favourites
          </Text>
          {favourites.length > 0 && (
            <Pressable onPress={() => setIsEditing(!isEditing)}>
              <Text style={[styles.editButton, { color: theme.subtext }]}>
                {isEditing ? "Done" : "Edit"}
              </Text>
            </Pressable>
          )}
        </View>
        {favourites.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="bookmark-outline" size={28} color={theme.subtext} />
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
              No saved locations yet
            </Text>
            <Text style={[styles.emptyHint, { color: theme.subtext }]}>
              Search for a city and tap the heart to save it
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            {favourites.map((item, index) => {
              const tempKey = `${item.latitude}-${item.longitude}`;
              const favData = favWeather[tempKey];
              return (
                <View key={`fav-${index}`}>
                  <Pressable
                    style={styles.resultRow}
                    onPress={() => !isEditing && handleSelectLocation(item)}
                  >
                    {isEditing && (
                      <Pressable
                        onPress={() =>
                          removeFavourite(item.latitude, item.longitude)
                        }
                        style={styles.deleteButton}
                        hitSlop={8}
                      >
                        <Ionicons
                          name="remove-circle"
                          size={22}
                          color="#FF3B30"
                        />
                      </Pressable>
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={[styles.cityName, { color: theme.text }]}>
                        {formatLocation(item)}
                      </Text>
                      <Text style={[styles.temp, { color: theme.subtext }]}>
                        {favData !== undefined
                          ? formatTemp(Math.round(favData.temp), unit)
                          : "Loading..."}
                      </Text>
                    </View>
                    {!isEditing && (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={theme.subtext}
                      />
                    )}
                  </Pressable>
                  {index < favourites.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.border },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Recents */}
        {recents.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              {recents.map((item, index) => (
                <View key={`recent-${index}`}>
                  <Pressable
                    style={styles.resultRow}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.subtext}
                    />
                    <View style={styles.resultInfo}>
                      <Text style={[styles.cityName, { color: theme.text }]}>
                        {formatLocation(item)}
                      </Text>
                    </View>
                    <Pressable onPress={() => removeRecent(item)} hitSlop={8}>
                      <Ionicons name="close" size={18} color={theme.subtext} />
                    </Pressable>
                  </Pressable>
                  {index < recents.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.border },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  searchButton: {
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 10,
    marginTop: 8,
    marginLeft: 4,
  },
  editButton: {
    fontSize: 15,
    fontWeight: "500",
  },
  currentCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 20,
    marginBottom: 24,
  },
  currentCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentCardLeft: {
    flex: 1,
    gap: 4,
  },
  currentLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  currentLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  currentTemp: {
    fontSize: 40,
    fontWeight: "200",
    letterSpacing: -1,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
    marginBottom: 24,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
  },
  temp: {
    fontSize: 13,
  },
  actionButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  divider: {
    height: 0.5,
    marginLeft: 16,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 32,
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 4,
  },
  emptyHint: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 18,
  },
});
