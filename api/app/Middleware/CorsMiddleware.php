<?php

namespace Nabta\Middleware;

/**
 * CORS Middleware
 */
class CorsMiddleware
{
    public static function handle(): void
    {
        $allowedOrigins = array_map(
            'trim',
            explode(',', getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://localhost:3000')
        );

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins, true) || empty($origin)) {
            $responseOrigin = empty($origin) ? '*' : $origin;
            header("Access-Control-Allow-Origin: $responseOrigin");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Max-Age: 86400");
            header("Vary: Origin");
        }

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}