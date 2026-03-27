# RainCheck 🌦️

**A Local and Global Weather Application**

RainCheck is a mobile weather application built with **React Native** and **Expo**. It provides users with real-time, high-fidelity weather data using a clean, intuitive interface. Whether checking the local forecast via GPS or searching for conditions halfway across the globe, RainCheck ensures users are never caught without an umbrella.

## 🚀 Features

- **Location-Based Weather:** Automatically detects the users current location via Geolocation API to show immediate local conditions.
- **Global Search:** Find weather data for any city worldwide using the Open-Meteo Geocoding API.
- **Favorites Management:** Users can save their most-searched cities to "My Weather Locations" for quick access with real-time temperature updates.
- **Dynamic Forecasts:** View current conditions, hourly breakdowns, and an extended 7-day forecast.
- **Personalized Settings:** Toggle between Celsius and Fahrenheit, 12h or 24h clock formats, and Light/Dark modes.
- **Offline Fallback:** Remembers the last searched city and unit preferences using **AsyncStorage** if GPS is unavailable.

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based Tab Navigation)
- **APIs:** Open-Meteo (Weather & Geocoding)
- **Storage:** AsyncStorage for persistent user preferences and favorites list.

## 📁 Project Structure

```text
RainCheck/
├── app/                  # Expo Router directory (File-based routing)
│   ├── (tabs)/           # Main Tab Navigator (_layout, Home(index), Search, Settings)
│   └── _layout.tsx       # Root layout with Context Providers
|   └── about.tsx         # Page containing developer information (Stack Navigation from settings page)
├── src/
│   ├── api/              # weatherApi, geocodeApi and location logic
│   ├── contexts/         # Favourites and Settings Context providers
|   ├── components/       # Components folder
│   ├── utils/            # Temperature and Time formatting helpers
└── assets/               # App icons and splash screens
```
