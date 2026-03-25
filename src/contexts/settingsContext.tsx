/*
Hooks help avoid repeating logic across files.
- loads unit + clock format from AsyncStorage
- exposes setters
- keeps settings screen small and clean
*/

/*
Contains saveX(), loadX(), and deleteX()
Keeps all data persistence in one area.
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type Unit = "celsius" | "fahrenheit";
type ClockFormat = "12h" | "24h";
type ThemeName = "light" | "dark";

type SettingsContextType = {
  unit: Unit;
  toggleUnit: () => void;

  clockFormat: ClockFormat;
  toggleClockFormat: () => void;

  themeName: ThemeName;
  toggleTheme: () => void;

  useCurrentLocation: boolean;
  toggleUseCurrentLocation: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>("celsius");
  const [clockFormat, setClockFormat] = useState<ClockFormat>("12h");
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const savedUnit = await AsyncStorage.getItem("unit");
        const savedClock = await AsyncStorage.getItem("clockFormat");
        const savedTheme = await AsyncStorage.getItem("themeName");
        const savedLocation = await AsyncStorage.getItem("useCurrentLocation");

        if (savedUnit) setUnit(savedUnit as Unit);
        if (savedClock) setClockFormat(savedClock as ClockFormat);
        if (savedTheme) setThemeName(savedTheme as ThemeName);
        if (savedLocation) setUseCurrentLocation(savedLocation === "true");
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("unit", unit);
    AsyncStorage.setItem("clockFormat", clockFormat);
    AsyncStorage.setItem("themeName", themeName);
    AsyncStorage.setItem("useCurrentLocation", String(useCurrentLocation));
  }, [unit, clockFormat, themeName, useCurrentLocation]);

  const toggleUnit = () =>
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));

  const toggleClockFormat = () =>
    setClockFormat((prev) => (prev === "24h" ? "12h" : "24h"));

  const toggleTheme = () =>
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));

  const toggleUseCurrentLocation = () => setUseCurrentLocation((prev) => !prev);

  return (
    <SettingsContext.Provider
      value={{
        unit,
        toggleUnit,
        clockFormat,
        toggleClockFormat,
        themeName,
        toggleTheme,
        useCurrentLocation,
        toggleUseCurrentLocation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
