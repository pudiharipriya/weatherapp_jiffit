# Jiffit_Weather_web_app
# 🌤️ Jiffit - Live Weather Web App

A modern, responsive, and aesthetic live weather application built with Vanilla HTML5, CSS3, JavaScript (ES6+), and powered by **Vite**.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)
![API](https://img.shields.io/badge/API-Open--Meteo-blue)

---

## ✨ Features

- 📍 **Auto Location Detection**: Automatically detects your current location via browser Geolocation & Reverse Geocoding.
- 🔍 **Global City Search**: Search live weather conditions for any city around the globe.
- 🌡️ **Detailed Current Weather**: Real-time temperature (°C), "feels like" temperature, humidity %, wind speed (km/h), weather icons, and detailed descriptions.
- 📅 **5-Day Weather Forecast**: Clear multi-day daily weather projections.
- 🎨 **Dynamic Glassmorphism & Adaptive Themes**: Smooth theme transitions that automatically switch based on weather conditions (Sunny, Rain, Default Cloud, Night Mode).
- 🔑 **No API Keys Needed**: Uses Open-Meteo public APIs requiring zero registration or API key configuration.

---

## 📁 Project Structure

```
weatherapp_jiffit/
├── index.html          # Main HTML markup with glassmorphism container
├── style.css           # Styling rules and dynamic color themes
├── script.js           # API integration, geolocation & DOM manipulation logic
├── package.json        # Project scripts and Vite dev dependency
└── README.md           # Project documentation
```

---

## 🚀 How to Run the Project

Follow these steps to set up and run the application locally on your machine.

### 📋 Prerequisites

Ensure you have **Node.js** (v16 or higher) and **npm** installed:
- Check Node version: `node -v`
- Check NPM version: `npm -v`

### 🔧 Installation & Running

1. **Open your terminal** and navigate to the project directory:
   ```bash
   cd OneDrive\Desktop\weatherapp_jiffit
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Click on the local URL provided in the terminal (typically `http://localhost:5173`).

---

## 📜 Available NPM Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Bundles and optimizes the app for production in the `dist/` directory.
- `npm run preview`: Bootstraps a local static web server to preview your production build (`dist/`).

---

## 🌐 APIs Used

- **[Open-Meteo Forecast API](https://open-meteo.com/)**: Fetches live weather data and 5-day forecasts.
- **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)**: Converts searched city names into latitude/longitude coordinates.
- **[BigDataCloud Reverse Geocode](https://www.bigdatacloud.com/)**: Resolves city names from user coordinates.
