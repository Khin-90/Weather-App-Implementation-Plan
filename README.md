# 🌦️ Weatherly — A Decoupled Weather App

Weatherly is a full-stack weather application built using a **decoupled architecture**. The frontend is powered by **Next.js with TypeScript** and styled with **TailwindCSS using RippleUI components**, while the backend is built using the **latest version of Laravel**, serving as an API wrapper around the [OpenWeatherMap API](https://openweathermap.org/api).

---

## 📸 Preview

> 🔗 [Wireframe Reference](https://docs.google.com/document/d/1b2c0PGxCRV34K06jz_D_OGpPKPR7CrVByB8OYmL33xY/edit)

![screenshot](preview.png) <!-- Optional: Add screenshot of the UI here -->

---

## 🧱 Tech Stack

| Layer        | Technology                |
| ------------ | ------------------------- |
| Frontend     | Next.js + TypeScript      |
| UI Framework | Tailwind CSS + RippleUI   |
| Backend      | Laravel (API only)        |
| HTTP Client  | `fetch` (frontend), `Http` facade (Laravel) |
| Data Source  | OpenWeatherMap API        |

---

## 🚀 Features

- 🔍 Search for weather by city
- 🌤️ Displays temperature, condition, humidity, and wind
- 💅 Clean responsive UI with RippleUI styling
- ⚡ Fast AJAX interactions via `fetch()`
- 🧠 Type-safe frontend using TypeScript
- 📂 Fully decoupled architecture for scalability

---

## 🛠️ Setup Instructions

### Backend (Laravel API)

1. Clone the backend:
   ```bash
   git clone # 🌦️ Weatherly — A Decoupled Weather App

Weatherly is a full-stack weather application built using a **decoupled architecture**. The frontend is powered by **Next.js with TypeScript** and styled with **TailwindCSS using RippleUI components**, while the backend is built using the **latest version of Laravel**, serving as an API wrapper around the [OpenWeatherMap API](https://openweathermap.org/api).

---

## 📸 Preview

> 🔗 [Wireframe Reference](https://docs.google.com/document/d/1b2c0PGxCRV34K06jz_D_OGpPKPR7CrVByB8OYmL33xY/edit)

![screenshot](preview.png) <!-- Optional: Add screenshot of the UI here -->

---

## 🧱 Tech Stack

| Layer        | Technology                |
| ------------ | ------------------------- |
| Frontend     | Next.js + TypeScript      |
| UI Framework | Tailwind CSS + RippleUI   |
| Backend      | Laravel (API only)        |
| HTTP Client  | `fetch` (frontend), `Http` facade (Laravel) |
| Data Source  | OpenWeatherMap API        |

---

## 🚀 Features

- 🔍 Search for weather by city
- 🌤️ Displays temperature, condition, humidity, and wind
- 💅 Clean responsive UI with RippleUI styling
- ⚡ Fast AJAX interactions via `fetch()`
- 🧠 Type-safe frontend using TypeScript
- 📂 Fully decoupled architecture for scalability

---

## 🛠️ Setup Instructions

### Backend (Laravel API)

1. Clone the backend:
   ```bash
   git clone https://github.com/your-username/weather-api.git
   cd weather-api
   composer install
   cp .env.example .env
   php artisan key:generate

   cd weather-api
   composer install
   cp .env.example .env
   php artisan key:generate
