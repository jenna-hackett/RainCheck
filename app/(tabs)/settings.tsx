/*
remember no logic here
- settings cards:
- location - link to expo location (location.ts?) toggle
- units - toggles. use settings context.
- support:
- about us = stack - pressable onPress use router to push
- report an issue mailto link. pressable
*/

import { getCurrentLocation } from "@/src/api/location";
import { useSettings } from "@/src/contexts/settingsContext";
import { weatherThemes } from "@/src/theme/theme";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const {
    unit,
    setUnit,
    clockFormat,
    setClockFormat,
    selectedLocation,
    setSelectedLocation,
    weatherCondition,
  } = useSettings();

  const theme = weatherThemes[weatherCondition];

  async function handleSwitch(value: boolean) {
    if (value) {
      //toggle on (yes)
      const coordinates = await getCurrentLocation();
      if (!coordinates) {
        return;
      }
      setSelectedLocation({
        city: "Current Location",
        country: "",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } else {
      //toggle off (no)
      setSelectedLocation(null);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={{ backgroundColor: theme.background }}>
        {/*this is the whole page*/}
        <View>
          {" "}
          {/*this is the title*/}
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>Location</Text>{" "}
          {/*this is location section*/}
          <View
            style={[
              styles.switchContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.label}>Use Current Location</Text>
            <View style={styles.switch}>
              <Text style={styles.label}>
                {selectedLocation ? "Yes" : "No"}
              </Text>
              <Switch value={!!selectedLocation} onValueChange={handleSwitch} />
            </View>
          </View>
        </View>
        <View>{/*this is unit section*/}</View>
        <View> {/*this is support section*/}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 25,
    paddingVertical: 10,
    fontWeight: 500,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
  },
  location: {},
  unit: {},
  support: {},
});
