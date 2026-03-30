import * as Location from "expo-location";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FavouritesProvider } from "../src/contexts/favouritesContext";
import { SettingsProvider, useSettings } from "../src/contexts/settingsContext";
import { weatherThemes } from "../src/theme/theme";

function AppContent() {
  const { weatherCondition } = useSettings();
  const theme = weatherThemes[weatherCondition];
  const isDarkTheme = [
    "cloudyNight",
    "clearNight",
    "mostlyClearNight",
    "thunder",
  ].includes(weatherCondition);

  useEffect(() => {
    async function requestPermissions() {
      await Location.requestForegroundPermissionsAsync();
    }
    requestPermissions();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        style={isDarkTheme ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FavouritesProvider>
        <AppContent />
      </FavouritesProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
