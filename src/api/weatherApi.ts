import { fetchWeatherApi } from "openmeteo";

export type WeatherData = {
  current: {
    time: Date;
    temperature: number;
    apparentTemperature: number;
    isDay: number;
    weatherCode: number;
  };
  hourly: {
    time: Date[];
    temperature: Float32Array;
    weatherCode: Float32Array;
    apparentTemperature: Float32Array;
  };
  daily: {
    time: Date[];
    maxTemp: Float32Array;
    weatherCode: Float32Array;
    minTemp: Float32Array;
  };
};

const url = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(
  latitude: number,
  longitude: number,
  unit: "celsius" | "fahrenheit",
): Promise<WeatherData | null> {
  try {
    const params = {
      latitude,
      longitude,
      daily: ["temperature_2m_max", "weather_code", "temperature_2m_min"],
      hourly: ["temperature_2m", "weather_code", "apparent_temperature"],
      current: [
        "temperature_2m",
        "apparent_temperature",
        "is_day",
        "weather_code",
      ],
      temperature_unit: unit,
    };
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature: current.variables(0)!.value(),
        apparentTemperature: current.variables(1)!.value(),
        isDay: current.variables(2)!.value(),
        weatherCode: current.variables(3)!.value(),
      },
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature: hourly.variables(0)!.valuesArray() ?? new Float32Array(),
        weatherCode: hourly.variables(1)!.valuesArray() ?? new Float32Array(),
        apparentTemperature:
          hourly.variables(2)!.valuesArray() ?? new Float32Array(),
      },
      daily: {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        maxTemp: daily.variables(0)!.valuesArray() ?? new Float32Array(),
        weatherCode: daily.variables(1)!.valuesArray() ?? new Float32Array(),
        minTemp: daily.variables(2)!.valuesArray() ?? new Float32Array(),
      },
    };

    return weatherData;
  } catch (error) {
    console.error(error);
    return null;
  }
}
