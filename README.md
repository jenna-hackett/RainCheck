# RainCheck 🌦️

**A Local and Global Weather Application**

RainCheck is a mobile weather application built with **React Native** and **Expo**. It provides real-time, high-fidelity weather data using a clean, intuitive interface. Whether checking a local forecast via GPS or searching for conditions halfway across the globe, RainCheck ensures users are never caught without an umbrella.

## 🚀 Features

- **Location-Based Weather:** Automatically detects the user's current location via Geolocation API to show immediate local conditions.
- **Global Search:** Find weather data for any city worldwide using the Open-Meteo Geocoding API.
- **Favorites Management:** Save most-searched cities to "My Weather Locations" for quick access with real-time temperature updates.
- **Dynamic Forecasts:** View current conditions, hourly breakdowns, and an extended 7-day forecast.
- **Personalized Settings:** Toggle between Celsius and Fahrenheit, 12h or 24h clock formats, and Light/Dark modes.
- **Offline Fallback:** Remembers the last searched city and unit preferences using **AsyncStorage** if GPS is unavailable.

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based Tab & Stack Navigation)
- **APIs:** Open-Meteo (Weather & Geocoding)
- **Storage:** AsyncStorage for persistent user preferences and favorites list.

## 📁 Project Structure

```text
RainCheck/
├── app/                  # Expo Router directory (File-based routing)
│   ├── (tabs)/           # Main Tab Navigator (include _layout, Home(index), Search, and Settings)
│   ├── _layout.tsx       # Root layout with Context Providers
│   └── about.tsx         # Developer information (Stack Navigation via Settings)
├── src/
│   ├── api/              # WeatherApi, GeocodeApi, and Location logic
│   ├── contexts/         # Favourites and Settings Context providers
│   ├── components/       # Reusable UI widgets (Weather cards, symbols)
│   └── utils/            # Temperature and Time formatting helpers
└── assets/               # App icons, splash screens, and local images
```
