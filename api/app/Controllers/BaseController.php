<?php

namespace Nabta\Controllers;

use Nabta\Helpers;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Base Controller - Parent class for all controllers
 */
abstract class BaseController
{
    protected $request = [];
    protected $queryParams = [];
    protected array $errors = [];

    public function __construct()
    {
        $this->request = $this->getRequestData();
        $this->queryParams = $_GET ?? [];
    }

    /**
     * Get request data (JSON or Form)
     */
    protected function getRequestData(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (strpos($contentType, 'application/json') !== false) {
            $json = file_get_contents('php://input');
            return json_decode($json, true) ?? [];
        }

        return $_POST ?? [];
    }

    /**
     * Get request input value
     */
    protected function input(string $key, $default = null)
    {
        return $this->request[$key] ?? $default;
    }

    /**
     * Get query parameter
     */
    protected function query(string $key, $default = null)
    {
        return $this->queryParams[$key] ?? $default;
    }

    /**
     * Get pagination parameters
     */
    protected function getPagination(): array
    {
        $page = (int)$this->query('page', 1);
        $perPage = (int)$this->query('per_page', 15);

        return [
            'page' => max(1, $page),
            'per_page' => min($perPage, 100), // Max 100 items per page
        ];
    }

    /**
     * Validate request inputs
     */
    protected function validate(array $rules): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $fieldRules) {
            $value = $this->input($field);
            $rulesList = explode('|', $fieldRules);

            foreach ($rulesList as $rule) {
                $this->validateField($field, $value, $rule);
            }
        }

        return empty($this->errors);
    }

    /**
     * Validate single field
     */
    private function validateField(string $field, $value, string $rule): void
    {
        [$ruleName, $parameter] = $this->parseRule($rule);

        switch ($ruleName) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field][] = "$field is required";
                }
                break;

            case 'email':
                if ($value && !Helpers\validateEmail($value)) {
                    $this->errors[$field][] = "$field must be a valid email";
                }
                break;

            case 'min':
                if ($value && mb_strlen($value) < $parameter) {
                    $this->errors[$field][] = "$field must be at least $parameter characters";
                }
                break;

            case 'max':
                if ($value && mb_strlen($value) > $parameter) {
                    $this->errors[$field][] = "$field must not exceed $parameter characters";
                }
                break;

            case 'unique':
                // Will be implemented in service layer
                break;

            case 'numeric':
                if ($value && !is_numeric($value)) {
                    $this->errors[$field][] = "$field must be numeric";
                }
                break;

            case 'url':
                if ($value && !Helpers\validateUrl($value)) {
                    $this->errors[$field][] = "$field must be a valid URL";
                }
                break;
        }
    }

    /**
     * Parse validation rule
     */
    private function parseRule(string $rule): array
    {
        if (strpos($rule, ':') !== false) {
            return explode(':', $rule, 2);
        }
        return [$rule, null];
    }

    /**
     * Get validation errors
     */
    protected function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Check if authenticated
     */
    protected function isAuthenticated(): bool
    {
        return isset($_SERVER['HTTP_AUTHORIZATION']);
    }

    /**
     * Get authenticated user ID from JWT
     */
    protected function getAuthUserId(): ?int
    {
        $token = $this->getBearerToken();
        if (!$token) {
            return null;
        }

        try {
            $decoded = JWT::decode(
                $token,
                new Key(getenv('JWT_SECRET'), 'HS256')
            );
            return $decoded->sub ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get Bearer token from Authorization header
     */
    protected function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (preg_match('/^Bearer\s+(.*)$/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Send success response
     */
    protected function success($data = null, string $message = 'Success', int $statusCode = 200): void
    {
        Helpers\successResponse($data, $message, $statusCode);
    }

    /**
     * Send error response
     */
    protected function error(string $message, $errors = null, int $statusCode = 400): void
    {
        Helpers\errorResponse($message, $errors, $statusCode);
    }

    /**
     * Method not allowed
     */
    protected function methodNotAllowed(): void
    {
        $this->error('Method not allowed', null, 405);
    }

    /**
     * Unauthorized response
     */
    protected function unauthorized(): void
    {
        $this->error('Unauthorized', null, 401);
    }

    /**
     * Forbidden response
     */
    protected function forbidden(): void
    {
        $this->error('Forbidden', null, 403);
    }

    /**
     * Not found response
     */
    protected function notFound(): void
    {
        $this->error('Not found', null, 404);
    }
}
