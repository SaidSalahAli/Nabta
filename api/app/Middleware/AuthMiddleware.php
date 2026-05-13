<?php

namespace Nabta\Middleware;

use Nabta\Helpers;

/**
 * Authentication Middleware
 */
class AuthMiddleware
{
    /**
     * Verify JWT token
     */
    public static function verify(): ?int
    {
        $token = self::getBearerToken();

        if (!$token) {
            return null;
        }

        try {
            $decoded = \Firebase\JWT\JWT::decode(
                $token,
                new \Firebase\JWT\Key(getenv('JWT_SECRET'), 'HS256')
            );

            return $decoded->sub ?? null;
        } catch (\Exception $e) {
            Helpers\logError('JWT Verification Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get Bearer token from Authorization header
     */
    private static function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (preg_match('/^Bearer\s+(.*)$/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Check if token is valid
     */
    public static function isValid(): bool
    {
        return self::verify() !== null;
    }

    /**
     * Get user ID from token
     */
    public static function getUserId(): ?int
    {
        return self::verify();
    }
}
