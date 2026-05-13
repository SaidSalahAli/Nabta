<?php

namespace Nabta\Helpers;

/**
 * Logging Helpers
 */
function logError(string $message, array $context = []): void
{
    $logDir = dirname(__DIR__) . '/storage/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/error-' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' | Context: ' . json_encode($context) : '';
    $logMessage = "[{$timestamp}] ERROR: {$message}{$contextStr}\n";
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

function logInfo(string $message, array $context = []): void
{
    $logDir = dirname(__DIR__) . '/storage/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/info-' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' | Context: ' . json_encode($context) : '';
    $logMessage = "[{$timestamp}] INFO: {$message}{$contextStr}\n";
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

/**
 * Response Helpers
 */
function apiResponse(int $statusCode, $data = null, ?string $message = null): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    
    $response = [
        'success' => $statusCode >= 200 && $statusCode < 300,
        'status_code' => $statusCode,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ];

    // Remove null message field if not provided
    if ($message === null) {
        unset($response['message']);
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function successResponse($data = null, ?string $message = null, int $statusCode = 200): void
{
    apiResponse($statusCode, $data, $message ?? 'Success');
}

function errorResponse(string $message, $errors = null, int $statusCode = 400): void
{
    $data = null;
    if ($errors !== null) {
        $data = ['errors' => $errors];
    }
    apiResponse($statusCode, $data, $message);
}

/**
 * Security Helpers
 */
function hashPassword(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

function verifyPassword(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

function sanitizeString(string $string): string
{
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

function validateEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * String Helpers
 */
function generateSlug(string $text): string
{
    // Remove non-ASCII characters
    $text = preg_replace('/[^\p{L}\p{N}\s\-]/u', '', $text);
    // Convert to lowercase
    $text = mb_strtolower($text, 'UTF-8');
    // Replace spaces with hyphens
    $text = preg_replace('/\s+/', '-', trim($text));
    // Remove multiple hyphens
    $text = preg_replace('/-+/', '-', $text);
    return $text;
}

function generateRandomString(int $length = 32): string
{
    return bin2hex(random_bytes($length / 2));
}

function generateToken(int $length = 64): string
{
    return bin2hex(random_bytes($length / 2));
}

/**
 * Array Helpers
 */
function filterArray(array $array, array $allowedKeys): array
{
    return array_filter(
        $array,
        fn($key) => in_array($key, $allowedKeys),
        ARRAY_FILTER_USE_KEY
    );
}

function getArrayValue(array $array, string $key, $default = null)
{
    return $array[$key] ?? $default;
}

/**
 * Validation Helpers
 */
function validateRequired(string $value): bool
{
    return !empty(trim($value));
}

function validateMinLength(string $value, int $length): bool
{
    return mb_strlen($value) >= $length;
}

function validateMaxLength(string $value, int $length): bool
{
    return mb_strlen($value) <= $length;
}

function validateUrl(string $url): bool
{
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

/**
 * Time Helpers
 */
function getCurrentTimestamp(): string
{
    return date('Y-m-d H:i:s');
}

function getUnixTimestamp(): int
{
    return time();
}

/**
 * Pagination Helper
 */
function getPaginationData(int $currentPage, int $totalItems, int $perPage = 15): array
{
    $totalPages = ceil($totalItems / $perPage);
    $offset = ($currentPage - 1) * $perPage;

    return [
        'current_page' => $currentPage,
        'per_page' => $perPage,
        'total_items' => $totalItems,
        'total_pages' => $totalPages,
        'offset' => $offset,
        'has_previous' => $currentPage > 1,
        'has_next' => $currentPage < $totalPages,
    ];
}

/**
 * Path Helpers
 */
function getProjectRoot(): string
{
    return dirname(dirname(__DIR__));
}

function getStoragePath(): string
{
    return getProjectRoot() . '/api/storage';
}

function getUploadsPath(): string
{
    return getStoragePath() . '/uploads';
}

function getLogsPath(): string
{
    return getStoragePath() . '/logs';
}
