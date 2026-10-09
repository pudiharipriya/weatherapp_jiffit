// DOM Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const weatherCard = document.getElementById('current-weather-card');
const forecastSection = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const tempEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescEl = document.getElementById('weather-desc');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');

// Map WMO codes to description and OpenWeatherMap icons
const weatherCodeMap = {
    0: { desc: 'Clear sky', icon: '01d', isSunny: true },
    1: { desc: 'Mainly clear', icon: '02d', isSunny: true },
    2: { desc: 'Partly cloudy', icon: '03d', isSunny: false },
    3: { desc: 'Overcast', icon: '04d', isSunny: false },
    45: { desc: 'Fog', icon: '50d', isSunny: false },
    48: { desc: 'Depositing rime fog', icon: '50d', isSunny: false },
    51: { desc: 'Light drizzle', icon: '09d', isRain: true },
    53: { desc: 'Moderate drizzle', icon: '09d', isRain: true },
    55: { desc: 'Dense drizzle', icon: '09d', isRain: true },
    61: { desc: 'Slight rain', icon: '10d', isRain: true },
    63: { desc: 'Moderate rain', icon: '10d', isRain: true },
    65: { desc: 'Heavy rain', icon: '10d', isRain: true },
    71: { desc: 'Slight snow', icon: '13d', isSunny: false },
    73: { desc: 'Moderate snow', icon: '13d', isSunny: false },
    75: { desc: 'Heavy snow', icon: '13d', isSunny: false },
    77: { desc: 'Snow grains', icon: '13d', isSunny: false },
    80: { desc: 'Slight rain showers', icon: '09d', isRain: true },
    81: { desc: 'Moderate rain showers', icon: '09d', isRain: true },
    82: { desc: 'Violent rain showers', icon: '09d', isRain: true },
    85: { desc: 'Slight snow showers', icon: '13d', isSunny: false },
    86: { desc: 'Heavy snow showers', icon: '13d', isSunny: false },
    95: { desc: 'Thunderstorm', icon: '11d', isRain: true },
    96: { desc: 'Thunderstorm with slight hail', icon: '11d', isRain: true },
    99: { desc: 'Thunderstorm with heavy hail', icon: '11d', isRain: true },
};

// Formatter for Date
const formatDate = (dateObj) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
};

// Application Initialization
function init() {
    // Attempt Auto-detect user location on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                // Reverse geocode to get city name
                const city = await getCityNameFromCoords(latitude, longitude);
                fetchWeatherDataByCoords(latitude, longitude, city);
            },
            error => {
                console.log("Geolocation denied or failed.", error);
                // Fallback default city if geolocation fails/is blocked
                fetchWeatherDataByCity('London');
            }
        );
    } else {
        fetchWeatherDataByCity('London');
    }
}

// Event Listeners for search
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherDataByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherDataByCity(city);
    }
});

async function getCityNameFromCoords(lat, lon) {
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await res.json();
        return data.city || data.locality || "Current Location";
    } catch (e) {
        return "Current Location";
    }
}

// Fetch functions using Open-Meteo (No API Key Required!)
async function fetchWeatherDataByCity(city) {
    showLoading();
    try {
        // 1. Convert City to Coordinates using Open-Meteo Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Fetch Weather using Coordinates
        await fetchWeatherDataByCoords(latitude, longitude, `${name}, ${country}`);
    } catch (error) {
        showError(error.message === "City not found" ? "City not found" : "Unable to fetch data");
    }
}

async function fetchWeatherDataByCoords(lat, lon, locationName) {
    if(!loading.classList.contains('hidden')) { /* Already loading */ } else { showLoading(); }
    
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        if (!res.ok) throw new Error("Unable to fetch data");
        const weatherData = await res.json();

        updateUI(weatherData, locationName);
    } catch (error) {
        showError("Unable to fetch data");
    }
}

// Update the entire UI
function updateUI(data, locationName) {
    hideLoading();
    hideError();

    const current = data.current;
    const daily = data.daily;
    const isDay = current.is_day;
    
    // Map WMO code
    const wmo = weatherCodeMap[current.weather_code] || { desc: 'Unknown', icon: '03d', isSunny: false, isRain: false };
    
    // Correct icon for night if necessary
    let currentIcon = wmo.icon;
    if (isDay === 0) {
        currentIcon = currentIcon.replace('d', 'n');
    }

    // 1. Map Current Weather Data
    cityNameEl.textContent = locationName;
    currentDateEl.textContent = formatDate(new Date());
    tempEl.textContent = Math.round(current.temperature_2m);
    feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    
    weatherDescEl.textContent = wmo.desc;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`;
    weatherIconEl.classList.remove('hidden');

    // 2. Change dynamic background
    updateTheme(wmo.isRain, wmo.isSunny, isDay);

    // 3. Update 5-day forecast
    updateForecastUI(daily);

    // Reveal UI
    weatherCard.classList.remove('hidden');
    forecastSection.classList.remove('hidden');
}

function updateForecastUI(daily) {
    forecastContainer.innerHTML = '';
    
    // Open-Meteo Daily array contains elements for next 7 days. We'll take 5.
    for (let i = 1; i <= 5; i++) {
        // Skip index 0 (today)
        const dateStr = daily.time[i];
        const dateObj = new Date(dateStr);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const wmoCode = daily.weather_code[i];
        const wmoInfo = weatherCodeMap[wmoCode] || { icon: '03d' };

        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-item');
        forecastEl.innerHTML = `
            <span class="forecast-date">${dayStr}</span>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${wmoInfo.icon}.png" alt="Weather">
            <span class="forecast-temp">${maxTemp}°C</span>
        `;
        forecastContainer.appendChild(forecastEl);
    }
}

// Background Theming
function updateTheme(isRain, isSunny, isDay) {
    // Remove previous themes
    document.body.className = '';
    
    if (isDay === 0) {
        document.body.classList.add('theme-night');
    } else if (isRain) {
        document.body.classList.add('theme-rain');
    } else if (isSunny) {
        document.body.classList.add('theme-sunny');
    } else {
        document.body.classList.add('theme-default'); // Clouds, etc.
    }
}

// Utility Functions
function showLoading() {
    loading.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    forecastSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(msg) {
    hideLoading();
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Start app
init();
