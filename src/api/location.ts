import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_LOCATION: Coordinates = {
  latitude: 51.0447,
  longitude: -114.0719,
};

export async function getCurrentLocation(): Promise<Coordinates> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return DEFAULT_LOCATION;

    const lastKnown = await Location.getLastKnownPositionAsync({});
    if (lastKnown) {
      return {
        latitude: lastKnown.coords.latitude,
        longitude: lastKnown.coords.longitude,
      };
    }

    const location = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000)),
    ]);

    if (!location) return DEFAULT_LOCATION;

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Location error:", error);
    return DEFAULT_LOCATION;
  }
}

export async function getLocationName(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results.length > 0) {
      const { city, region, country } = results[0];
      if (city && country) return `${city}, ${country}`;
      if (region && country) return `${region}, ${country}`;
      if (country) return country;
    }
    return "Calgary, Canada";
  } catch (error) {
    console.error(error);
    return "Calgary, Canada";
  }
}
