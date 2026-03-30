import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSettings } from "../../src/contexts/settingsContext";
import { useHomeWeather } from "../../src/hooks/useHomeWeather";
import { weatherThemes } from "../../src/theme/theme";
import { formatTemp } from "../../src/utils/formatTemperature";
import { formatTime } from "../../src/utils/formatTime";
import {
  getConditionLabel,
  getDateLabel,
  getDayLabel,
  getHourlyForToday,
  getTodayDateLabel,
  getWeatherIcon,
} from "../../src/utils/weatherHelpers";

export default function HomeScreen() {
  const { unit, clockFormat, weatherCondition } = useSettings();
  const { weather, locationName, loading, goToSearch } = useHomeWeather();
  const theme = weatherThemes[weatherCondition];

  if (loading) {
    return (
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.centered}>
          <Ionicons name="cloud-outline" size={48} color={theme.subtext} />
          <Text style={[styles.loadingText, { color: theme.subtext }]}>
            Fetching weather...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!weather) {
    return (
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={48} color={theme.subtext} />
          <Text style={[styles.noLocationTitle, { color: theme.text }]}>
            No location set
          </Text>
          <Text style={[styles.noLocationSub, { color: theme.subtext }]}>
            Search for a city to see the weather
          </Text>
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
            onPress={goToSearch}
          >
            <Ionicons name="search-outline" size={16} color={theme.text} />
            <Text style={[styles.searchButtonText, { color: theme.text }]}>
              Choose a location
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCode = weather.current.weatherCode;
  const isDay = weather.current.isDay;
  const hourlyToday = getHourlyForToday(weather);

  return (
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.date, { color: theme.subtext }]}>
          {getTodayDateLabel()}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={theme.subtext} />
          <Text style={[styles.locationName, { color: theme.text }]}>
            {locationName}
          </Text>
        </View>

        {/* Current weather hero */}
        <View style={styles.currentWeather}>
          <Ionicons
            name={getWeatherIcon(currentCode, isDay) as any}
            size={100}
            color={theme.text}
            style={styles.weatherIcon}
          />
          <Text style={[styles.currentTemp, { color: theme.text }]}>
            {Math.round(weather.current.temperature)}°
          </Text>
          <Text style={[styles.conditionLabel, { color: theme.text }]}>
            {getConditionLabel(currentCode)}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="arrow-up" size={14} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.subtext }]}>
                {formatTemp(Math.round(weather.daily.maxTemp[0]), unit)}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="arrow-down" size={14} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.subtext }]}>
                {formatTemp(Math.round(weather.daily.minTemp[0]), unit)}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="body-outline" size={14} color={theme.subtext} />
              <Text style={[styles.metaText, { color: theme.subtext }]}>
                Feels like {Math.round(weather.current.apparentTemperature)}°
              </Text>
            </View>
          </View>
        </View>

        {/* Hourly forecast */}
        {hourlyToday.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Today
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.hourlyScroll}
              contentContainerStyle={styles.hourlyContent}
            >
              {hourlyToday.map((hour, index) => (
                <View
                  key={index}
                  style={[
                    styles.hourlyCard,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.hourlyTime, { color: theme.subtext }]}>
                    {formatTime(hour.time, clockFormat)}
                  </Text>
                  <Ionicons
                    name={getWeatherIcon(hour.weatherCode, 1) as any}
                    size={22}
                    color={theme.text}
                  />
                  <Text style={[styles.hourlyTemp, { color: theme.text }]}>
                    {Math.round(hour.temp)}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* 7-day forecast */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          7-Day Forecast
        </Text>
        <View
          style={[
            styles.dailyCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {weather.daily.time.map((date, index) => (
            <View
              key={index}
              style={[
                styles.dailyRow,
                index < weather.daily.time.length - 1 && {
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.dailyDay, { color: theme.text }]}>
                {getDayLabel(date, index)}
              </Text>
              <Text style={[styles.dailyDate, { color: theme.subtext }]}>
                {getDateLabel(date)}
              </Text>
              <Ionicons
                name={
                  getWeatherIcon(weather.daily.weatherCode[index], 1) as any
                }
                size={20}
                color={theme.text}
              />
              <Text style={[styles.dailyTemp, { color: theme.text }]}>
                {Math.round(weather.daily.maxTemp[index])}°
              </Text>
              <Text style={[styles.dailyTempLow, { color: theme.subtext }]}>
                {Math.round(weather.daily.minTemp[index])}°
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 15,
    marginTop: 8,
  },
  noLocationTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  noLocationSub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  date: {
    fontSize: 13,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationName: {
    fontSize: 22,
    fontWeight: "700",
  },
  currentWeather: {
    alignItems: "center",
    paddingVertical: 24,
  },
  weatherIcon: {
    marginBottom: 8,
  },
  currentTemp: {
    fontSize: 88,
    fontWeight: "200",
    lineHeight: 96,
    letterSpacing: -4,
  },
  conditionLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 8,
    opacity: 0.7,
  },
  hourlyScroll: {
    marginBottom: 24,
  },
  hourlyContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  hourlyCard: {
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    borderWidth: 0.5,
    gap: 8,
    minWidth: 68,
  },
  hourlyTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  hourlyTemp: {
    fontSize: 15,
    fontWeight: "600",
  },
  dailyCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dailyDay: {
    fontSize: 15,
    fontWeight: "500",
    width: 52,
  },
  dailyDate: {
    fontSize: 13,
    flex: 1,
  },
  dailyTemp: {
    fontSize: 15,
    fontWeight: "600",
    width: 40,
    textAlign: "right",
  },
  dailyTempLow: {
    fontSize: 15,
    width: 36,
    textAlign: "right",
  },
});
