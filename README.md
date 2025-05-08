# 🌦️ Weatherly — A Decoupled Weather Application

Weatherly is a modern weather application built with a decoupled architecture, featuring a Next.js frontend and Laravel API backend. This project demonstrates clean architecture principles, type safety with TypeScript, and responsive UI design.

## ✨ Features

### Frontend (Next.js)
- 🔍 City search with autocomplete
- 🌡️ Current weather conditions (temp, humidity, wind)
- 📱 Fully responsive RippleUI/Tailwind design
- ⚡ Real-time data fetching with `fetch()`
- 🛡️ Type-safe components with TypeScript

### Backend (Laravel API)
- 🚀 Lightweight API wrapper for OpenWeatherMap
- 🔄 Request validation and error handling
- 📊 API response caching
- 🔐 Environment-based configuration

## 📦 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS + RippleUI
- React hooks for state management

**Backend**
- Laravel 11 (API-only)
- Guzzle HTTP client
- Redis caching (optional)

**Services**
- OpenWeatherMap API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer 2+
- OpenWeatherMap API key

### Installation

**1. Backend Setup**
```bash
git clone https://github.com/Khin-90/Weather-App-Implementation-Plan.git
cd weather-api

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set your OpenWeatherMap API key
echo "WEATHER_API_KEY=your_api_key_here" >> .env

# Start development server
php artisan serve
