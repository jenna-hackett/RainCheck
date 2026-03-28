import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading weather...
        </Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          No location set.
        </Text>
        <TouchableOpacity
          style={[styles.searchButton, { borderColor: theme.border }]}
          onPress={goToSearch}
        >
          <Text style={{ color: theme.text }}>Choose a location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCode = weather.current.weatherCode;
  const isDay = weather.current.isDay;
  const hourlyToday = getHourlyForToday(weather);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Text style={[styles.date, { color: theme.subtext }]}>
        {getTodayDateLabel()}
      </Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={20} color={theme.text} />
        <Text style={[styles.locationName, { color: theme.text }]}>
          {locationName}
        </Text>
      </View>

      {/* Current weather */}
      <View style={styles.currentWeather}>
        <Ionicons
          name={getWeatherIcon(currentCode, isDay) as any}
          size={120}
          color={theme.text}
        />
        <Text style={[styles.currentTemp, { color: theme.text }]}>
          {Math.round(weather.current.temperature)}°
        </Text>
        <Text style={[styles.conditionRow, { color: theme.subtext }]}>
          {getConditionLabel(currentCode)} | H:{" "}
          {formatTemp(Math.round(weather.daily.maxTemp[0]), unit)} L:{" "}
          {formatTemp(Math.round(weather.daily.minTemp[0]), unit)} | Feels like{" "}
          {Math.round(weather.current.apparentTemperature)}°
        </Text>
      </View>

      {/* Hourly forecast */}
      {hourlyToday.length > 0 && (
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
              <Text style={[styles.hourlyTime, { color: theme.text }]}>
                {formatTime(hour.time, clockFormat)}
              </Text>
              <Ionicons
                name={getWeatherIcon(hour.weatherCode, 1) as any}
                size={24}
                color={theme.text}
              />
              <Text style={[styles.hourlyTemp, { color: theme.text }]}>
                {Math.round(hour.temp)}°
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 7-day forecast */}
      <View
        style={[
          styles.dailyCard,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.dailyTitle, { color: theme.text }]}>
          7 Day Forecast
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dailyRow}>
            {weather.daily.time.map((date, index) => (
              <View key={index} style={styles.dailyItem}>
                <Text style={[styles.dailyDate, { color: theme.text }]}>
                  {getDateLabel(date)}
                </Text>
                <Text style={[styles.dailyTemp, { color: theme.text }]}>
                  {Math.round(weather.daily.maxTemp[index])}°
                </Text>
                <Ionicons
                  name={
                    getWeatherIcon(weather.daily.weatherCode[index], 1) as any
                  }
                  size={24}
                  color={theme.subtext}
                />
                <Text style={[styles.dailyDay, { color: theme.subtext }]}>
                  {getDayLabel(date, index)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  searchButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 24,
  },
  locationName: {
    fontSize: 24,
    fontWeight: "600",
  },
  currentWeather: {
    alignItems: "center",
    marginBottom: 32,
  },
  currentTemp: {
    fontSize: 96,
    fontWeight: "bold",
    lineHeight: 110,
  },
  conditionRow: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  hourlyScroll: {
    marginBottom: 32,
  },
  hourlyContent: {
    gap: 10,
    paddingHorizontal: 4,
  },
  hourlyCard: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    minWidth: 70,
  },
  hourlyTime: {
    fontSize: 13,
    fontWeight: "600",
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: "500",
  },
  dailyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dailyRow: {
    flexDirection: "row",
    gap: 16,
  },
  dailyItem: {
    alignItems: "center",
    gap: 6,
    minWidth: 48,
  },
  dailyDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  dailyTemp: {
    fontSize: 14,
    fontWeight: "500",
  },
  dailyDay: {
    fontSize: 12,
  },
});
