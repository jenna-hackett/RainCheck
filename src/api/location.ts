import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function getCurrentLocation(): Promise<Coordinates | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
