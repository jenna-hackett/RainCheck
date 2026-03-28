import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GeocodeResult } from "../api/geocodeApi";
import { WeatherCondition } from "../theme/theme";

type Unit = "celsius" | "fahrenheit";
type ClockFormat = "12h" | "24h";

type SettingsContextType = {
  unit: Unit;
  clockFormat: ClockFormat;
  weatherCondition: WeatherCondition;
  selectedLocation: GeocodeResult | null;
  setUnit: (unit: Unit) => void;
  setClockFormat: (format: ClockFormat) => void;
  setWeatherCondition: (condition: WeatherCondition) => void;
  setSelectedLocation: (location: GeocodeResult | null) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const defaultCondition = (
    (systemScheme ?? "light") === "dark" ? "clearNight" : "sunny"
  ) as WeatherCondition;

  const [unit, setUnitState] = useState<Unit>("celsius");
  const [clockFormat, setClockFormatState] = useState<ClockFormat>("24h");
  const [weatherCondition, setWeatherCondition] =
    useState<WeatherCondition>(defaultCondition);
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodeResult | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [savedUnit, savedClock] = await AsyncStorage.multiGet([
          "unit",
          "clockFormat",
        ]);
        if (savedUnit[1]) setUnitState(savedUnit[1] as Unit);
        if (savedClock[1]) setClockFormatState(savedClock[1] as ClockFormat);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    loadSettings();
  }, []);

  function setUnit(unit: Unit) {
    setUnitState(unit);
    AsyncStorage.setItem("unit", unit);
  }

  function setClockFormat(format: ClockFormat) {
    setClockFormatState(format);
    AsyncStorage.setItem("clockFormat", format);
  }

  return (
    <SettingsContext.Provider
      value={{
        unit,
        clockFormat,
        weatherCondition,
        selectedLocation,
        setUnit,
        setClockFormat,
        setWeatherCondition,
        setSelectedLocation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
