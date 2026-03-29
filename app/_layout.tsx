import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { FavouritesProvider } from "../src/contexts/favouritesContext";
import { SettingsProvider, useSettings } from "../src/contexts/settingsContext";
import { weatherThemes } from "../src/theme/theme";

function AppContent() {
  const { weatherCondition } = useSettings();
  const theme = weatherThemes[weatherCondition];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="auto" />
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
