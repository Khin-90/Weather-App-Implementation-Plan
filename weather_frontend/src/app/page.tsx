"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Define interfaces for the weather data to ensure type safety
interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

interface CloudsData {
  all: number;
}

interface SysData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface WeatherData {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WindData;
  clouds: CloudsData;
  dt: number;
  sys: SysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
  message?: string; // For error messages from API
}

interface DailyForecastItem {
  dt: number;
  main: { temp_max: number; temp_min: number; };
  weather: WeatherCondition[];
  // Add other relevant daily forecast fields if needed
}

interface HourlyForecastItem {
  dt: number;
  main: { temp: number; };
  weather: WeatherCondition[];
  // Add other relevant hourly forecast fields if needed
}

// Helper function to get weather icon class
const getWeatherIconClass = (iconCode: string) => {
  const iconMap: { [key: string]: string } = {
    "01d": "fas fa-sun text-yellow-400",
    "01n": "fas fa-moon text-blue-300",
    "02d": "fas fa-cloud-sun text-yellow-300",
    "02n": "fas fa-cloud-moon text-blue-200",
    "03d": "fas fa-cloud text-gray-400",
    "03n": "fas fa-cloud text-gray-500",
    "04d": "fas fa-cloud-meatball text-gray-500",
    "04n": "fas fa-cloud-meatball text-gray-600",
    "09d": "fas fa-cloud-showers-heavy text-blue-400",
    "09n": "fas fa-cloud-showers-heavy text-blue-500",
    "10d": "fas fa-cloud-sun-rain text-blue-300",
    "10n": "fas fa-cloud-moon-rain text-blue-400",
    "11d": "fas fa-bolt text-yellow-500",
    "11n": "fas fa-bolt text-yellow-600",
    "13d": "fas fa-snowflake text-blue-200",
    "13n": "fas fa-snowflake text-blue-300",
    "50d": "fas fa-smog text-gray-500",
    "50n": "fas fa-smog text-gray-600",
  };
  return iconMap[iconCode] || "fas fa-question-circle text-gray-400";
};

const Droplet = ({ id }: { id: number }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s, ${Math.random() * 2}s`,
    '--fall-duration': `${0.5 + Math.random() * 0.8}s`,
    '--slide-duration': `${1.5 + Math.random() * 1}s`,
    '--slide-amount': `${Math.random() * 10 - 5}px`,
    '--droplet-width': `${1 + Math.random() * 2}px`,
    '--droplet-height': `${5 + Math.random() * 10}px`,
    '--droplet-opacity': `${0.3 + Math.random() * 0.4}`,
  } as React.CSSProperties;
  return <div className="droplet" style={style}></div>;
};

export default function HomePage() {
  const [city, setCity] = useState<string>("Nairobi");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  const fetchWeatherData = useCallback(async (targetCity: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(targetCity)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
      setWeatherData(null);
    }
    setLoading(false);
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city, fetchWeatherData]);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setCity(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const handleUnitToggle = (newUnit: "celsius" | "fahrenheit") => {
    setUnit(newUnit);
    setIsUnitDropdownOpen(false);
  };

  const convertTemp = (tempCelsius: number) => {
    if (unit === "fahrenheit") {
      return Math.round((tempCelsius * 9/5) + 32);
    }
    return Math.round(tempCelsius);
  };

  const formatDate = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: "UTC" });
  };

  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: "UTC" });
  };

  const getBackgroundClass = () => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) return "bg-gray-50 dark:bg-gray-900";
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes("rain")) return "bg-blue-200 dark:bg-blue-800 water-droplets-bg";
    if (condition.includes("clouds")) return "bg-gray-300 dark:bg-gray-700 animate-clouds";
    if (condition.includes("clear")) return "bg-sky-300 dark:bg-sky-700 animate-sunshine";
    if (condition.includes("snow")) return "bg-blue-100 dark:bg-blue-400 animate-snow";
    return "bg-gray-50 dark:bg-gray-900";
  };

  const numberOfDroplets = 50; // Adjust for more or fewer droplets

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBackgroundClass()} text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <div className="loading-pulse text-2xl">Loading Weatherly... <i className="fas fa-spinner fa-spin"></i></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${getBackgroundClass()} text-red-500 dark:text-red-400 p-4 transition-colors duration-200`}>
        <div className="text-2xl mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchWeatherData(city)} 
          className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBackgroundClass()} text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        No weather data available. Try searching for a city.
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getBackgroundClass()} text-gray-900 dark:text-gray-100 transition-colors duration-200 relative overflow-hidden`}>
      {getBackgroundClass().includes("water-droplets-bg") && (
        <div className="water-droplets-container absolute inset-0 pointer-events-none">
          {[...Array(numberOfDroplets)].map((_, i) => <Droplet key={i} id={i} />)}
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <i className={`fas fa-cloud-sun text-3xl text-primary-500 mr-3 ${getWeatherIconClass(weatherData.weather[0].icon)}`}></i>
            <h1 className="text-2xl font-bold">Weatherly</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              id="theme-toggle" 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkTheme ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            <div className="relative">
              <button 
                id="unit-toggle" 
                onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                className="px-4 py-2 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors w-16 text-center"
              >
                <span id="unit-display">{unit === "celsius" ? "°C" : "°F"}</span>
              </button>
              {isUnitDropdownOpen && (
                <div id="unit-dropdown" className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5"> {/* Increased z-index for dropdown */}
                  <button onClick={() => handleUnitToggle("celsius")} className="unit-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">°C</button>
                  <button onClick={() => handleUnitToggle("fahrenheit")} className="unit-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">°F</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative mb-8 max-w-xl mx-auto">
          <div className="relative flex">
            <input
              type="text"
              id="city-search"
              placeholder="Search for a city... (e.g., London, New York)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-6 py-4 rounded-l-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              autoComplete="off"
            />
            <button 
              id="search-button" 
              onClick={handleSearch}
              className="bg-primary-500 text-white p-4 rounded-r-full hover:bg-primary-600 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div id="weather-dashboard" className="fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center mb-4 self-center md:self-start">
                  <h2 className="text-2xl font-bold mr-4" id="current-city">{weatherData.name}, {weatherData.sys.country}</h2>
                </div>
                 <span id="current-date" className="text-gray-500 dark:text-gray-400 text-sm mb-4 self-center md:self-start">{formatDate(weatherData.dt, weatherData.timezone)}</span>

                <div className="flex items-center mb-6 self-center md:self-start">
                  <div className="text-6xl font-bold mr-4" id="current-temp">{convertTemp(weatherData.main.temp)}°</div>
                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold capitalize" id="current-condition">{weatherData.weather[0].description}</div>
                    <div className="text-gray-500 dark:text-gray-400" id="current-feels-like">Feels like {convertTemp(weatherData.main.feels_like)}°</div>
                  </div>
                </div>

                <div id="current-icon" className={`text-7xl sm:text-8xl mb-6 self-center md:self-start ${getWeatherIconClass(weatherData.weather[0].icon)}`}>
                </div>
              </div>

              <div className="md:w-1/2 p-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-wind text-primary-500 mr-2"></i>
                      <span className="font-medium">Wind</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="wind-arrow" id="wind-direction" style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}>
                          <i className="fas fa-arrow-up text-xl"></i>
                        </div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-semibold" id="wind-speed">{weatherData.wind.speed} <span className="text-sm">m/s</span></div>
                        {weatherData.wind.gust && <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400" id="wind-gust">Gusts: {weatherData.wind.gust} m/s</div>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-droplet text-primary-500 mr-2"></i>
                      <span className="font-medium">Humidity</span>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-semibold mb-1" id="humidity">{weatherData.main.humidity}%</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="humidity-bar bg-primary-500 h-2 rounded-full" style={{ width: `${weatherData.main.humidity}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-gauge text-primary-500 mr-2"></i>
                      <span className="font-medium">Pressure</span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold" id="pressure">{weatherData.main.pressure} <span className="text-sm">hPa</span></div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-eye text-primary-500 mr-2"></i>
                      <span className="font-medium">Visibility</span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold" id="visibility">{(weatherData.visibility / 1000).toFixed(1)} <span className="text-sm">km</span></div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-sunrise text-primary-500 mr-2"></i>
                      <span className="font-medium">Sunrise</span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold" id="sunrise">{formatTime(weatherData.sys.sunrise, weatherData.timezone)}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-sunset text-primary-500 mr-2"></i>
                      <span className="font-medium">Sunset</span>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold" id="sunset">{formatTime(weatherData.sys.sunset, weatherData.timezone)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Hourly Forecast</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 text-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{`${10 + i}:00`}</div>
                  <i className="fas fa-cloud-sun text-2xl my-2 text-yellow-400"></i>
                  <div className="font-medium">{20 + i}°</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
            <div className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                  <div className="w-1/3 font-medium">{day}</div>
                  <div className="w-1/3 text-center">
                    <i className="fas fa-cloud-sun-rain text-xl text-blue-400"></i>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Rain</span>
                  </div>
                  <div className="w-1/3 text-right font-medium">
                    <span>{25 + i}°</span> / <span className="text-gray-500 dark:text-gray-400">{15 + i}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

