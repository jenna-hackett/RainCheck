/*
- settings cards:
TODO: add mailto link to issue pressable
- add logic to unit and temp
- add stack nav to about us page
*/

import { getCurrentLocation } from "@/src/api/location";
import { useSettings } from "@/src/contexts/settingsContext";
import { weatherThemes } from "@/src/theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
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

  async function handleLocation(value: boolean) {
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

  function handleTemp(value: boolean) {
    setUnit(value ? "celsius" : "fahrenheit");
  }

  function handleClock() {}

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
              <Switch
                value={!!selectedLocation}
                onValueChange={handleLocation}
              />
            </View>
          </View>
        </View>
        <View>
          {/*this is unit section*/}
          <View>
            <Text style={styles.subtitle}>Unit</Text>{" "}
            <View
              style={[
                styles.switchContainer,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={styles.label}>Temperature</Text>
              <View style={styles.switch}>
                <Text style={styles.label}>
                  {unit === "celsius" ? "°C" : "°F"}
                </Text>
                <Switch value={unit === "celsius"} onValueChange={handleTemp} />
              </View>
            </View>
            <View
              style={[
                styles.switchContainer,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={styles.label}>Clock</Text>
              <View style={styles.switch}>
                <Text style={styles.label}>
                  {selectedLocation ? "12H" : "24H"}
                </Text>
                <Switch
                  value={!!selectedLocation}
                  onValueChange={handleClock}
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          {/*this is support section*/}
          <Text style={styles.subtitle}>Support</Text>
          <Pressable
            style={[
              styles.supportContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.label}>About Us</Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </Pressable>
          <Pressable
            style={[
              styles.supportContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={styles.label}>Report An Issue</Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </Pressable>
        </View>
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
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 25,
    paddingVertical: 15,
    fontWeight: 500,
    marginTop: 10,
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
  supportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
  },
});
