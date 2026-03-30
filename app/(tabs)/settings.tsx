import { getCurrentLocation, getLocationName } from "@/src/api/location";
import { useSettings } from "@/src/contexts/settingsContext";
import { weatherThemes } from "@/src/theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
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
    setSelectedLocation,
    isGPSLocation,
    setIsGPSLocation,
    setGpsLocation,
    weatherCondition,
  } = useSettings();

  const router = useRouter();
  const theme = weatherThemes[weatherCondition];
  const [locationLoading, setLocationLoading] = useState(false);

  async function handleLocation(value: boolean) {
    if (value) {
      setLocationLoading(true);
      const coordinates = await getCurrentLocation();
      if (!coordinates) {
        setLocationLoading(false);
        return;
      }
      const name = await getLocationName(
        coordinates.latitude,
        coordinates.longitude,
      );
      const gps = {
        city: name,
        country: "",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      setIsGPSLocation(true);
      setGpsLocation(gps);
      setSelectedLocation(gps);
      setLocationLoading(false);
    } else {
      setIsGPSLocation(false);
      setGpsLocation(null);
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
    <SafeAreaView
      edges={["top", "bottom", "left", "right"]}
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        {/* Location section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Location
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              Use Current Location
            </Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.subtext }]}>
                {isGPSLocation ? "On" : "Off"}
              </Text>
              <Switch
                value={isGPSLocation}
                onValueChange={handleLocation}
                disabled={locationLoading}
                thumbColor="white"
                trackColor={{ true: theme.subtext, false: theme.border }}
              />
            </View>
          </View>
        </View>

        {/* Unit section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Unit</Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              Temperature
            </Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.subtext }]}>
                {unit === "celsius" ? "°C" : "°F"}
              </Text>
              <Switch
                value={unit === "celsius"}
                onValueChange={handleTemp}
                thumbColor="white"
                trackColor={{ true: theme.subtext, false: theme.border }}
              />
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>Clock</Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: theme.subtext }]}>
                {clockFormat === "12h" ? "12h" : "24h"}
              </Text>
              <Switch
                value={clockFormat === "12h"}
                onValueChange={handleClock}
                thumbColor="white"
                trackColor={{ true: theme.subtext, false: theme.border }}
              />
            </View>
          </View>
        </View>

        {/* Support section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Support
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable style={styles.row} onPress={() => router.push("/about")}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              About Us
            </Text>
            <Entypo name="chevron-right" size={20} color={theme.subtext} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Pressable style={styles.row} onPress={handleReport}>
            <Text style={[styles.rowLabel, { color: theme.text }]}>
              Report an Issue
            </Text>
            <Entypo name="chevron-right" size={20} color={theme.subtext} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowValue: {
    fontSize: 15,
  },
  divider: {
    height: 0.5,
    marginLeft: 16,
  },
});
