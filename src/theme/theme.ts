export type WeatherCondition =
  | "sunny"
  | "mostlySunny"
  | "cloudyDay"
  | "rainy"
  | "thunder"
  | "cloudyNight"
  | "mostlyClearNight";

export type Theme = {
  background: string;
  cardBackground: string;
  text: string;
  subtext: string;
  border: string;
};

export const weatherThemes: Record<WeatherCondition, Theme> = {
  sunny: {
    background: "#D6EFFF",
    cardBackground: "rgba(255,255,255,0.45)",
    text: "#1A2E3D",
    subtext: "#3A5A72",
    border: "rgba(255,255,255,0.6)",
  },
  mostlySunny: {
    background: "#F5F0C8",
    cardBackground: "rgba(255,255,255,0.45)",
    text: "#2E2A10",
    subtext: "#5A5230",
    border: "rgba(255,255,255,0.6)",
  },
  cloudyDay: {
    background: "#EFEFEF",
    cardBackground: "rgba(255,255,255,0.45)",
    text: "#1E1E1E",
    subtext: "#555555",
    border: "rgba(255,255,255,0.6)",
  },
  rainy: {
    background: "#C8C8DC",
    cardBackground: "rgba(255,255,255,0.35)",
    text: "#1A1A2E",
    subtext: "#3A3A5A",
    border: "rgba(255,255,255,0.5)",
  },
  thunder: {
    background: "#8C8C9E",
    cardBackground: "rgba(255,255,255,0.2)",
    text: "#FFFFFF",
    subtext: "#E0E0E8",
    border: "rgba(255,255,255,0.25)",
  },
  cloudyNight: {
    background: "#1A2238",
    cardBackground: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    subtext: "#A0AABF",
    border: "rgba(255,255,255,0.12)",
  },
  mostlyClearNight: {
    background: "#2D2145",
    cardBackground: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    subtext: "#B0A8CC",
    border: "rgba(255,255,255,0.12)",
  },
};

export function getWeatherCondition(
  weatherCode: number,
  isDay: number,
): WeatherCondition {
  if (isDay === 0) {
    if (weatherCode === 0 || weatherCode === 1) return "mostlyClearNight";
    return "cloudyNight";
  }
  if (weatherCode === 0) return "sunny";
  if (weatherCode === 1 || weatherCode === 2) return "mostlySunny";
  if (weatherCode === 3) return "cloudyDay";
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy";
  if (weatherCode >= 71 && weatherCode <= 77) return "cloudyDay";
  if (weatherCode >= 80 && weatherCode <= 82) return "rainy";
  if (weatherCode >= 95 && weatherCode <= 99) return "thunder";
  return isDay === 1 ? "cloudyDay" : "cloudyNight";
}
