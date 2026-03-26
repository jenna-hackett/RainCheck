import { Stack } from "expo-router";
import { FavouritesProvider } from "../src/contexts/favouritesContext";
import { SettingsProvider } from "../src/contexts/settingsContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FavouritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </FavouritesProvider>
    </SettingsProvider>
  );
}
