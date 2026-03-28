import { WeatherData } from "../api/weatherApi";

export function getWeatherIcon(weatherCode: number, isDay: number): string {
  if (isDay === 0) {
    if (weatherCode === 0) return "moon";
    if (weatherCode <= 2) return "partly-sunny";
    return "cloudy-night";
  }
  if (weatherCode === 0) return "sunny";
  if (weatherCode <= 2) return "partly-sunny";
  if (weatherCode === 3) return "cloudy";
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy";
  if (weatherCode >= 71 && weatherCode <= 77) return "snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "rainy";
  if (weatherCode >= 95 && weatherCode <= 99) return "thunderstorm";
  return "cloudy";
}

export function getConditionLabel(weatherCode: number): string {
  if (weatherCode === 0) return "Clear";
  if (weatherCode === 1) return "Mostly Clear";
  if (weatherCode === 2) return "Partly Cloudy";
  if (weatherCode === 3) return "Cloudy";
  if (weatherCode >= 51 && weatherCode <= 55) return "Drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "Rainy";
  if (weatherCode >= 71 && weatherCode <= 77) return "Snowy";
  if (weatherCode >= 80 && weatherCode <= 82) return "Showers";
  if (weatherCode >= 95 && weatherCode <= 99) return "Thunderstorm";
  return "Cloudy";
}

export function getTodayDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getDayLabel(date: Date, index: number): string {
  if (index === 0) return "Today";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getHourlyForToday(weather: WeatherData) {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);

  return weather.hourly.time
    .map((time: Date, i: number) => ({
      time,
      temp: weather.hourly.temperature[i],
      weatherCode: weather.hourly.weatherCode[i],
    }))
    .filter(
      (h: { time: Date; temp: number; weatherCode: number }) =>
        h.time >= now && h.time <= midnight,
    );
}
