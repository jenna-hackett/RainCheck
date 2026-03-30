import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { getCurrentLocation, getLocationName } from "../api/location";
import { getWeather, WeatherData } from "../api/weatherApi";
import { useSettings } from "../contexts/settingsContext";
import { getWeatherCondition } from "../theme/theme";

export function useHomeWeather() {
  const {
    unit,
    selectedLocation,
    setWeatherCondition,
    setSelectedLocation,
    setIsGPSLocation,
    setGpsLocation,
  } = useSettings();
  const [weather, setWeatherData] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const hasAutoLoaded = useRef(false);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);

      let lat: number;
      let lon: number;

      if (selectedLocation) {
        lat = selectedLocation.latitude;
        lon = selectedLocation.longitude;
        setLocationName(
          selectedLocation.admin1
            ? `${selectedLocation.city}, ${selectedLocation.admin1}, ${selectedLocation.country}`
            : selectedLocation.country
              ? `${selectedLocation.city}, ${selectedLocation.country}`
              : selectedLocation.city,
        );
      } else if (!hasAutoLoaded.current) {
        hasAutoLoaded.current = true;
        const coords = await getCurrentLocation();
        if (!coords) {
          setLoading(false);
          setLocationName("No location");
          return;
        }
        lat = coords.latitude;
        lon = coords.longitude;
        const name = await getLocationName(lat, lon);
        const gps = {
          city: name,
          country: "",
          latitude: lat,
          longitude: lon,
        };
        setIsGPSLocation(true);
        setGpsLocation(gps);
        setSelectedLocation(gps);
        setLoading(false);
        return;
      } else {
        setWeatherData(null);
        setLocationName("No location");
        setLoading(false);
        return;
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
