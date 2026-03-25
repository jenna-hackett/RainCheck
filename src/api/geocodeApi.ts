export type GeocodeResult = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export async function geocodeCity(
  query: string,
): Promise<GeocodeResult[] | null> {
  if (!query || query.trim().length === 0) return null;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return data.results.map((item: any) => ({
      city: item.name,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}
