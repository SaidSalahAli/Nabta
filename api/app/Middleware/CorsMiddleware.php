<?php

namespace Nabta\Middleware;

/**
 * CORS Middleware
 */
class CorsMiddleware
{
    /**
     * Handle CORS
     */
    public static function handle(): void
    {
        $allowedOrigins = explode(',', getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:5173');
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Max-Age: 86400");
        }

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
