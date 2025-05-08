<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
        ]);

        $city = $request->input('city');
        $apiKey = env('OPENWEATHERMAP_API_KEY');
        // It's good practice to control SSL verification via an environment variable for flexibility
        // e.g., $disableSslVerification = env('OPENWEATHERMAP_DISABLE_SSL_VERIFY', false);

        if (!$apiKey) {
            Log::error('OpenWeatherMap API key not configured.');
            return response()->json(['error' => 'API key not configured. Please contact support.'], 500);
        }

        $apiUrl = "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid={$apiKey}&units=metric";

        try {
            // Modified to disable SSL verification for local development troubleshooting
            // For production, ensure your server's CA certificates are up to date.
            // You could make this conditional: Http::when($disableSslVerification, fn($http) => $http->withoutVerifying())->timeout(10)->get($apiUrl);
            $response = Http::withoutVerifying()->timeout(10)->get($apiUrl);

            if ($response->failed()) {
                Log::error('OpenWeatherMap API request failed.', [
                    'city' => $city,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);
                return response()->json(['error' => 'Failed to fetch weather data. Please try again later or check the city name.'], $response->status());
            }

            $weatherData = $response->json();

            return response()->json($weatherData);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('ConnectionException while calling OpenWeatherMap API.', [
                'city' => $city,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Could not connect to the weather service. Please try again later.'], 503); // Service Unavailable
        } catch (\Exception $e) {
            Log::error('An unexpected error occurred while fetching weather data.', [
                'city' => $city,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'An unexpected error occurred. Please try again later.'], 500);
        }
    }
}

