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
import { useRouter } from "expo-router";
import {
  Linking,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
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

  const router = useRouter();

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

  function handleClock(value: boolean) {
    setClockFormat(value ? "12h" : "24h");
  }

  function handleReport() {
    Linking.openURL(
      "mailto:aurorachoban@edu.sait.ca?subject=Report%20An%20Issue&body=Enter%20Your%20Issue%20Here",
    );
  }

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.background }]}>
      <View>
        {/*this is the whole page*/}
        <View>
          {/*this is the title*/}
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>
        <View>
          <Text style={[styles.subtitle, { color: theme.text }]}>Location</Text>
          {/*this is location section*/}
          <View
            style={[
              styles.switchContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Use Current Location
            </Text>
            <View style={styles.switch}>
              <Text style={[styles.label, { color: theme.text }]}>
                {selectedLocation ? "Yes" : "No"}
              </Text>
              <Switch
                value={!!selectedLocation}
                onValueChange={handleLocation}
                thumbColor="white"
                trackColor={{ true: theme.text, false: theme.text }}
              />
            </View>
          </View>
        </View>
        <View>
          {/*this is unit section*/}
          <View>
            <Text style={[styles.subtitle, { color: theme.text }]}>Unit</Text>
            <View
              style={[
                styles.switchContainer,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Temperature
              </Text>
              <View style={styles.switch}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {unit === "celsius" ? "°C" : "°F"}
                </Text>
                <Switch
                  value={unit === "celsius"}
                  onValueChange={handleTemp}
                  thumbColor="white"
                  trackColor={{ true: theme.text, false: theme.text }}
                />
              </View>
            </View>
            <View
              style={[
                styles.switchContainer,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <Text style={[styles.label, { color: theme.text }]}>Clock</Text>
              <View style={styles.switch}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {clockFormat === "12h" ? "12h" : "24h"}
                </Text>
                <Switch
                  value={clockFormat === "12h"}
                  onValueChange={handleClock}
                  thumbColor="white"
                  trackColor={{ true: theme.text, false: theme.text }}
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          {/*this is support section*/}
          <Text style={[styles.subtitle, { color: theme.text }]}>Support</Text>
          <Pressable
            onPress={() => router.push("/about")}
            style={[
              styles.supportContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>About Us</Text>
            <Entypo name="chevron-right" size={24} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={handleReport}
            style={[
              styles.supportContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>
              Report An Issue
            </Text>
            <Entypo name="chevron-right" size={24} color={theme.text} />
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
    flexDirection: "column",
    flex: 1,
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
