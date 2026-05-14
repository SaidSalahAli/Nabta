<?php

namespace Nabta\Config;

use Dotenv\Dotenv;

/**
 * Environment Configuration Manager
 */
class Config
{
    private static array $config = [];
    private static bool $loaded = false;

    /**
     * Load environment variables
     */
    public static function load(?string $path = null): void
    {
        if (self::$loaded) {
            return;
        }

        $envPath = $path ?? dirname(__DIR__);

        if (file_exists($envPath . '/.env')) {
            try {
                $dotenv = Dotenv::createImmutable($envPath);
                $dotenv->load();
            } catch (\Exception $e) {
                error_log('Failed to load .env file: ' . $e->getMessage());
            }
        }

        self::$loaded = true;
    }

    /**
     * Get configuration value
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        self::load();
        return getenv($key) ?: $default;
    }

    /**
     * Check if configuration exists
     */
    public static function has(string $key): bool
    {
        self::load();
        return getenv($key) !== false;
    }

    /**
     * Get all configuration as array
     */
    public static function all(): array
    {
        self::load();
        return array_merge($_ENV, $_SERVER);
    }

    /**
     * Set configuration value
     */
    public static function set(string $key, mixed $value): void
    {
        $_ENV[$key] = $value;
        putenv($key . '=' . $value);
    }
}