# Weather App Deployment Guide

This guide provides instructions for deploying the Weatherly application, which consists of a Laravel backend and a Next.js frontend.

## Prerequisites

### General
- Git (for cloning repositories if you version control them)
- A server or hosting platform for both backend and frontend.

### Backend (Laravel API - `weather_api` directory)
- PHP (>= 8.1 recommended, check `composer.json` for specific version)
- Composer (PHP dependency manager)
- A web server (e.g., Nginx or Apache)
- A database server (e.g., MySQL, PostgreSQL) - though this specific app version doesn't use a database beyond Laravel's default setup, a full Laravel app typically would.
- Access to configure the web server (e.g., virtual hosts).
- OpenWeatherMap API Key (you already have this: `3634a580346980920728a1de5d2bf593`)

### Frontend (Next.js App - `weather_frontend` directory)
- Node.js (>= 18.x recommended, check `package.json` or Next.js documentation for specific version)
- pnpm (or npm/yarn, but the project was set up with pnpm)

## Backend Deployment (Laravel API - `weather_api`)

1.  **Transfer Project Files:**
    Upload the `weather_api` directory to your server.

2.  **Install Dependencies:**
    Navigate to the `weather_api` directory on your server and run:
    ```bash
    composer install --optimize-autoloader --no-dev
    ```

3.  **Configure Environment Variables:**
    -   Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and update the following variables:
        -   `APP_NAME`: Your application name (e.g., "WeatherlyAPI")
        -   `APP_ENV`: Set to `production`
        -   `APP_KEY`: This will be generated in the next step. If it's already filled from the development environment, it's best to regenerate for production.
        -   `APP_DEBUG`: Set to `false` for production.
        -   `APP_URL`: The public URL where your Laravel API will be accessible (e.g., `https://api.yourdomain.com`).
        -   `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Configure these if you are using a database (not strictly necessary for the current weather functionality but good for general Laravel setup).
        -   `OPENWEATHERMAP_API_KEY`: Set this to your OpenWeatherMap API key (`3634a580346980920728a1de5d2bf593`).

4.  **Generate Application Key:**
    Run the following command to generate a unique application key:
    ```bash
    php artisan key:generate
    ```

5.  **Clear Configuration and Cache (Recommended for Production):**
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache # If you had views, not critical for API-only
    ```

6.  **Storage Link:**
    If your application uses public storage (not in this specific version, but common in Laravel):
    ```bash
    php artisan storage:link
    ```

7.  **Web Server Configuration:**
    Configure your web server (Nginx or Apache) to serve your Laravel application. The document root should point to the `weather_api/public` directory.

    **Example Nginx Configuration Snippet:**
    ```nginx
    server {
        listen 80;
        server_name api.yourdomain.com; # Your API domain
        root /path/to/your/weather_api/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";

        index index.php;

        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location = /favicon.ico { access_log off; log_not_found off; }
        location = /robots.txt  { access_log off; log_not_found off; }

        error_page 404 /index.php;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.x-fpm.sock; # Adjust PHP-FPM socket path
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
    ```
    Remember to replace placeholders like `api.yourdomain.com`, `/path/to/your/weather_api/public`, and the `fastcgi_pass` socket path with your actual values. Reload/restart your web server after making changes.

8.  **File Permissions:**
    Ensure that the `storage` and `bootstrap/cache` directories are writable by the web server.
    ```bash
    sudo chown -R www-data:www-data storage bootstrap/cache # Adjust www-data if your server uses a different user
    sudo chmod -R 775 storage bootstrap/cache
    ```

## Frontend Deployment (Next.js App - `weather_frontend`)

1.  **Transfer Project Files:**
    Upload the `weather_frontend` directory to your server or deployment platform.

2.  **Configure Environment Variables:**
    -   In the `weather_frontend` directory, create a file named `.env.local` (this file should not be committed to Git if you use version control).
    -   Add the following line to `.env.local`, replacing the URL with the actual public URL of your deployed Laravel backend:
        ```
        NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
        ```
        (Ensure the backend URL points to the `/api` route where the weather endpoint is defined).

3.  **Install Dependencies:**
    Navigate to the `weather_frontend` directory and run:
    ```bash
    pnpm install
    ```
    (Or `npm install` or `yarn install` if you prefer, though pnpm was used during development).

4.  **Build the Application:**
    Run the build command to create an optimized production build:
    ```bash
    pnpm build
    ```
    This will create a `.next` directory with the build output.

5.  **Serve the Application:**
    There are several ways to serve a Next.js application in production:

    *   **Using `next start`:**
        You can use the built-in Next.js server. You'll need Node.js running on your server (e.g., using PM2 to keep it alive).
        ```bash
        pnpm start # This will typically run `next start` on the default port 3000
        ```
        You would then typically use a reverse proxy (like Nginx or Apache) to forward requests from port 80/443 to port 3000.

    *   **Exporting as a Static Site (if applicable):**
        If your app doesn't heavily rely on Next.js server-side features for every page (this app uses client-side rendering with API calls, so it *might* be exportable, but API routes and dynamic server-side rendering would prevent this), you could export it as static HTML/CSS/JS files:
        ```bash
        # Add `output: 'export'` to next.config.mjs if not already there
        # pnpm build 
        ```
        Then serve the `out` directory with any static web server. *However, given the dynamic API calls and client-side nature, `next start` or a Node.js hosting platform is generally preferred for full Next.js capabilities.*

    *   **Using a Platform (Vercel, Netlify, etc.):**
        Platforms like Vercel (from the creators of Next.js) or Netlify are optimized for Next.js deployment and handle much of the build and serving process for you. You would typically connect your Git repository to these platforms.

    *   **Custom Server / Docker:**
        You can create a custom Node.js server (e.g., with Express) to serve the `.next` folder, or containerize your application with Docker.

    **Example Nginx Reverse Proxy for `next start`:**
    If `pnpm start` runs your Next.js app on `http://localhost:3000`:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com; # Your frontend domain

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Remember to configure SSL (HTTPS) for production for both frontend and backend.

## Final Steps

1.  **DNS Configuration:**
    Ensure your domain names (e.g., `yourdomain.com` for frontend, `api.yourdomain.com` for backend) are pointing to your server's IP address.

2.  **Testing:**
    Thoroughly test the deployed application to ensure everything is working correctly, including API calls from the frontend to the backend.

3.  **SSL Certificates:**
    Set up SSL certificates (e.g., using Let's Encrypt) for both your frontend and backend domains to enable HTTPS. This is crucial for security.

This guide provides a general overview. Specific steps might vary slightly depending on your hosting environment and chosen tools.

