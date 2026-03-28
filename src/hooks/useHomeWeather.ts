import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentLocation } from "../api/location";
import { getWeather, WeatherData } from "../api/weatherApi";
import { useSettings } from "../contexts/settingsContext";
import { getWeatherCondition } from "../theme/theme";

export function useHomeWeather() {
  const { unit, selectedLocation, setWeatherCondition } = useSettings();
  const [weather, setWeatherData] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);

      let lat: number;
      let lon: number;

      if (selectedLocation) {
        lat = selectedLocation.latitude;
        lon = selectedLocation.longitude;
        setLocationName(
          `${selectedLocation.city}, ${selectedLocation.country}`,
        );
      } else {
        const coords = await getCurrentLocation();
        if (!coords) {
          setLoading(false);
          setLocationName("No location");
          return;
        }
        lat = coords.latitude;
        lon = coords.longitude;
        setLocationName("Current Location");
      }

      const data = await getWeather(lat, lon, unit);
      if (data) {
        setWeatherData(data);
        setWeatherCondition(
          getWeatherCondition(data.current.weatherCode, data.current.isDay),
        );
      }
      setLoading(false);
    }

    loadWeather();
  }, [selectedLocation, unit]);

  const goToSearch = () => router.push("/(tabs)/search");

  return { weather, locationName, loading, goToSearch };
}
