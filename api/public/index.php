<?php

/**
 * Nabta Educational Platform - API Entry Point
 * Version: 1.0.0
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// Define base path
define('BASE_PATH', __DIR__);
define('API_VERSION', 'v1');

// Autoloading
require_once BASE_PATH . '/vendor/autoload.php';

// Load helpers
require_once BASE_PATH . '/app/Helpers/helpers.php';

// Load environment
use Nabta\Config\Config;
use Nabta\Middleware\CorsMiddleware;

Config::load(BASE_PATH);

// Handle CORS
CorsMiddleware::handle();

// Get the request path
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$baseUrl = '/api/' . API_VERSION;

// Remove base URL from path
if (strpos($requestPath, $baseUrl) === 0) {
    $path = substr($requestPath, strlen($baseUrl));
} else {
    $path = $requestPath;
}

// Remove trailing slash and query string
$path = rtrim($path, '/');
if (empty($path)) {
    $path = '/';
}

// Route mapping
$routes = [
    // Auth routes
    'POST:/auth/register' => ['controller' => 'AuthController', 'action' => 'register'],
    'POST:/auth/login' => ['controller' => 'AuthController', 'action' => 'login'],
    'GET:/auth/me' => ['controller' => 'AuthController', 'action' => 'me'],
    'PUT:/auth/profile' => ['controller' => 'AuthController', 'action' => 'updateProfile'],
    'POST:/auth/change-password' => ['controller' => 'AuthController', 'action' => 'changePassword'],
    'POST:/auth/logout' => ['controller' => 'AuthController', 'action' => 'logout'],
    'POST:/auth/google' => ['controller' => 'AuthController', 'action' => 'googleLogin'],

    // Episode routes
    'GET:/episodes' => ['controller' => 'EpisodeController', 'action' => 'index'],
    'GET:/episodes/featured' => ['controller' => 'EpisodeController', 'action' => 'featured'],
    'GET:/episodes/search' => ['controller' => 'EpisodeController', 'action' => 'search'],
    'POST:/episodes' => ['controller' => 'EpisodeController', 'action' => 'store'],
    'GET:/episodes/{slug}' => ['controller' => 'EpisodeController', 'action' => 'show', 'params' => ['slug']],
    'GET:/categories/{categoryId}/episodes' => ['controller' => 'EpisodeController', 'action' => 'byCategory', 'params' => ['categoryId']],
    'PUT:/episodes/{id}' => ['controller' => 'EpisodeController', 'action' => 'update', 'params' => ['id']],
    'DELETE:/episodes/{id}' => ['controller' => 'EpisodeController', 'action' => 'destroy', 'params' => ['id']],
    'GET:/series/{seriesId}/episodes' => ['controller' => 'EpisodeController', 'action' => 'seriesEpisodes', 'params' => ['seriesId']],

    // Category routes
    'GET:/categories' => ['controller' => 'CategoryController', 'action' => 'index'],
    'GET:/categories/{type}' => ['controller' => 'CategoryController', 'action' => 'getByType', 'params' => ['type']],
    'POST:/categories' => ['controller' => 'CategoryController', 'action' => 'store'],
    'PUT:/categories/{id}' => ['controller' => 'CategoryController', 'action' => 'update', 'params' => ['id']],
    'DELETE:/categories/{id}' => ['controller' => 'CategoryController', 'action' => 'destroy', 'params' => ['id']],

    // Application routes
    'GET:/applications' => ['controller' => 'ApplicationController', 'action' => 'index'],
    'GET:/applications/featured' => ['controller' => 'ApplicationController', 'action' => 'featured'],
    'GET:/applications/search' => ['controller' => 'ApplicationController', 'action' => 'search'],
    'GET:/applications/{slug}' => ['controller' => 'ApplicationController', 'action' => 'show', 'params' => ['slug']],
    'POST:/applications' => ['controller' => 'ApplicationController', 'action' => 'store'],
    'PUT:/applications/{id}' => ['controller' => 'ApplicationController', 'action' => 'update', 'params' => ['id']],
    'DELETE:/applications/{id}' => ['controller' => 'ApplicationController', 'action' => 'destroy', 'params' => ['id']],

    // Worksheet routes
    'GET:/worksheets' => ['controller' => 'WorksheetController', 'action' => 'index'],
    'GET:/worksheets/free' => ['controller' => 'WorksheetController', 'action' => 'free'],
    'GET:/worksheets/search' => ['controller' => 'WorksheetController', 'action' => 'search'],
    'GET:/worksheets/{slug}' => ['controller' => 'WorksheetController', 'action' => 'show', 'params' => ['slug']],
    'POST:/worksheets/{id}/download' => ['controller' => 'WorksheetController', 'action' => 'download', 'params' => ['id']],
    'POST:/worksheets' => ['controller' => 'WorksheetController', 'action' => 'store'],
    'PUT:/worksheets/{id}' => ['controller' => 'WorksheetController', 'action' => 'update', 'params' => ['id']],
    'DELETE:/worksheets/{id}' => ['controller' => 'WorksheetController', 'action' => 'destroy', 'params' => ['id']],

    // Media/Upload routes
    'POST:/media/upload' => ['controller' => 'MediaController', 'action' => 'upload'],
    'GET:/media/{id}' => ['controller' => 'MediaController', 'action' => 'show', 'params' => ['id']],
    'DELETE:/media/{id}' => ['controller' => 'MediaController', 'action' => 'delete', 'params' => ['id']],

    // Settings routes
    'GET:/settings' => ['controller' => 'SettingsController', 'action' => 'getAll'],
    'GET:/settings/{key}' => ['controller' => 'SettingsController', 'action' => 'get', 'params' => ['key']],
    'PUT:/settings/{key}' => ['controller' => 'SettingsController', 'action' => 'update', 'params' => ['key']],

    // Contact routes
    'POST:/contact' => ['controller' => 'ContactController', 'action' => 'store'],
    'GET:/contact/messages' => ['controller' => 'ContactController', 'action' => 'index'],

    // Newsletter routes
    'POST:/newsletter/subscribe' => ['controller' => 'NewsletterController', 'action' => 'subscribe'],
    'POST:/newsletter/unsubscribe' => ['controller' => 'NewsletterController', 'action' => 'unsubscribe'],

    // Dashboard routes
    'GET:/dashboard/stats' => ['controller' => 'DashboardController', 'action' => 'stats'],
    'GET:/dashboard/analytics' => ['controller' => 'DashboardController', 'action' => 'analytics'],

    // SEO routes
    'GET:/seo/pages' => ['controller' => 'SeoController', 'action' => 'getPages'],
    'POST:/seo/pages' => ['controller' => 'SeoController', 'action' => 'createPage'],
    'PUT:/seo/pages/{id}' => ['controller' => 'SeoController', 'action' => 'updatePage', 'params' => ['id']],

    // Health check
    'GET:/' => ['controller' => 'HealthController', 'action' => 'check'],
];

// Route matching function
function matchRoute($path, $method, $routes)
{
    $fullPath = $method . ':' . $path;

    // Direct match
    if (isset($routes[$fullPath])) {
        return ['route' => $routes[$fullPath], 'params' => []];
    }

    // Pattern matching for dynamic routes
    foreach ($routes as $route => $handler) {
        [$routeMethod, $routePath] = explode(':', $route, 2);

        if ($routeMethod !== $method) {
            continue;
        }

        // Convert route pattern to regex
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<\1>[^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';

        if (preg_match($pattern, $path, $matches)) {
            $params = [];
            foreach ($handler['params'] ?? [] as $paramName) {
                if (isset($matches[$paramName])) {
                    $params[$paramName] = $matches[$paramName];
                }
            }
            return ['route' => $handler, 'params' => $params];
        }
    }

    return null;
}

// Execute route
$match = matchRoute($path, $_SERVER['REQUEST_METHOD'], $routes);

if (!$match) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'status_code' => 404,
        'message' => 'Route not found',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

try {
    $route = $match['route'];
    $params = $match['params'];
    $controllerName = 'Nabta\\Controllers\\' . $route['controller'];

    if (!class_exists($controllerName)) {
        throw new Exception("Controller {$route['controller']} not found");
    }

    $controller = new $controllerName();
    $action = $route['action'];

    if (!method_exists($controller, $action)) {
        throw new Exception("Action {$action} not found in {$route['controller']}");
    }

    // Call action with parameters
    if (!empty($params)) {
        call_user_func_array([$controller, $action], array_values($params));
    } else {
        $controller->$action();
    }
} catch (Exception $e) {
    \Nabta\Helpers\logError('Route Exception: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'status_code' => 500,
        'message' => 'Internal Server Error',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}
