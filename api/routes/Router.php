<?php

namespace Nabta\Routes;

/**
 * Router - API Routes Handler
 */
class Router
{
    private array $routes = [];
    private string $currentMethod = '';
    private string $currentUri = '';

    public function __construct()
    {
        $this->currentMethod = $_SERVER['REQUEST_METHOD'];
        $this->currentUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }

    /**
     * Register GET route
     */
    public function get(string $path, $callback): self
    {
        $this->routes['GET'][$path] = $callback;
        return $this;
    }

    /**
     * Register POST route
     */
    public function post(string $path, $callback): self
    {
        $this->routes['POST'][$path] = $callback;
        return $this;
    }

    /**
     * Register PUT route
     */
    public function put(string $path, $callback): self
    {
        $this->routes['PUT'][$path] = $callback;
        return $this;
    }

    /**
     * Register DELETE route
     */
    public function delete(string $path, $callback): self
    {
        $this->routes['DELETE'][$path] = $callback;
        return $this;
    }

    /**
     * Register PATCH route
     */
    public function patch(string $path, $callback): self
    {
        $this->routes['PATCH'][$path] = $callback;
        return $this;
    }

    /**
     * Dispatch request to appropriate handler
     */
    public function dispatch(): void
    {
        $route = $this->matchRoute();

        if (!$route) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'status_code' => 404,
                'message' => 'Route not found',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            exit;
        }

        if (is_array($route)) {
            [$controller, $method] = $route;
            $instance = new $controller();
            $instance->$method();
        } elseif (is_callable($route)) {
            call_user_func($route);
        }
    }

    /**
     * Match current request to a route
     */
    private function matchRoute()
    {
        $routes = $this->routes[$this->currentMethod] ?? [];

        foreach ($routes as $pattern => $callback) {
            if ($this->matchPattern($pattern, $this->currentUri)) {
                return $callback;
            }
        }

        return null;
    }

    /**
     * Match URI pattern with regex
     */
    private function matchPattern(string $pattern, string $uri): bool
    {
        $pattern = preg_replace('/\{[a-zA-Z_][a-zA-Z0-9_]*\}/', '([a-zA-Z0-9_-]+)', $pattern);
        $pattern = '#^' . $pattern . '$#';
        return (bool)preg_match($pattern, $uri);
    }
}
