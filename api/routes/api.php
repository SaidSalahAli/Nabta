<?php

namespace Nabta\Routes;

use Nabta\Controllers\{
    HealthController,
    AuthController,
    EpisodeController,
    CategoryController,
    ApplicationController,
    WorksheetController,
    MediaController,
    ContactController,
    NewsletterController,
    SettingsController,
    DashboardController,
    SeoController
};

/**
 * API Routes Configuration
 */
class ApiRoutes
{
    public static function register(Router $router): void
    {
        // Health Check
        $router->get('/api/v1/health', [HealthController::class, 'check']);

        // ===== AUTH ROUTES =====
        $router->post('/api/v1/auth/register', [AuthController::class, 'register']);
        $router->post('/api/v1/auth/login', [AuthController::class, 'login']);
        $router->post('/api/v1/auth/logout', [AuthController::class, 'logout']);
        $router->post('/api/v1/auth/refresh', [AuthController::class, 'refresh']);
        $router->get('/api/v1/auth/me', [AuthController::class, 'me']);
        $router->post('/api/v1/auth/profile/update', [AuthController::class, 'updateProfile']);
        $router->post('/api/v1/auth/change-password', [AuthController::class, 'changePassword']);
        $router->post('/api/v1/auth/verify-email', [AuthController::class, 'verifyEmail']);

        // ===== EPISODES ROUTES =====
        $router->get('/api/v1/episodes', [EpisodeController::class, 'index']);
        $router->get('/api/v1/episodes/featured', [EpisodeController::class, 'featured']);
        $router->get('/api/v1/episodes/search', [EpisodeController::class, 'search']);
        $router->get('/api/v1/episodes/category', [EpisodeController::class, 'byCategory']);
        $router->get('/api/v1/episodes/{id}', [EpisodeController::class, 'show']);
        $router->get('/api/v1/episodes/{slug}/slug', [EpisodeController::class, 'showBySlug']);
        $router->get('/api/v1/episodes/{id}/related', [EpisodeController::class, 'related']);

        // Admin Episodes
        $router->post('/api/v1/admin/episodes', [EpisodeController::class, 'store']);
        $router->put('/api/v1/admin/episodes/{id}', [EpisodeController::class, 'update']);
        $router->delete('/api/v1/admin/episodes/{id}', [EpisodeController::class, 'destroy']);

        // ===== CATEGORIES ROUTES =====
        $router->get('/api/v1/categories', [CategoryController::class, 'index']);
        $router->get('/api/v1/categories/{type}', [CategoryController::class, 'getByType']);
        $router->get('/api/v1/categories/{id}/with-counts', [CategoryController::class, 'withCounts']);

        // Admin Categories
        $router->post('/api/v1/admin/categories', [CategoryController::class, 'store']);
        $router->put('/api/v1/admin/categories/{id}', [CategoryController::class, 'update']);
        $router->delete('/api/v1/admin/categories/{id}', [CategoryController::class, 'destroy']);

        // ===== APPLICATIONS ROUTES =====
        $router->get('/api/v1/applications', [ApplicationController::class, 'index']);
        $router->get('/api/v1/applications/featured', [ApplicationController::class, 'featured']);
        $router->get('/api/v1/applications/trending', [ApplicationController::class, 'trending']);
        $router->get('/api/v1/applications/search', [ApplicationController::class, 'search']);
        $router->get('/api/v1/applications/category', [ApplicationController::class, 'byCategory']);
        $router->get('/api/v1/applications/{id}', [ApplicationController::class, 'show']);
        $router->get('/api/v1/applications/{slug}/slug', [ApplicationController::class, 'showBySlug']);

        // Admin Applications
        $router->post('/api/v1/admin/applications', [ApplicationController::class, 'store']);
        $router->put('/api/v1/admin/applications/{id}', [ApplicationController::class, 'update']);
        $router->delete('/api/v1/admin/applications/{id}', [ApplicationController::class, 'destroy']);
        $router->post('/api/v1/admin/applications/{id}/gallery', [ApplicationController::class, 'addGallery']);

        // ===== WORKSHEETS ROUTES =====
        $router->get('/api/v1/worksheets', [WorksheetController::class, 'index']);
        $router->get('/api/v1/worksheets/free', [WorksheetController::class, 'free']);
        $router->get('/api/v1/worksheets/trending', [WorksheetController::class, 'trending']);
        $router->get('/api/v1/worksheets/search', [WorksheetController::class, 'search']);
        $router->get('/api/v1/worksheets/category', [WorksheetController::class, 'byCategory']);
        $router->get('/api/v1/worksheets/grade/{grade}', [WorksheetController::class, 'byGrade']);
        $router->get('/api/v1/worksheets/{id}', [WorksheetController::class, 'show']);
        $router->get('/api/v1/worksheets/{slug}/slug', [WorksheetController::class, 'showBySlug']);
        $router->post('/api/v1/worksheets/{id}/download', [WorksheetController::class, 'download']);

        // Admin Worksheets
        $router->post('/api/v1/admin/worksheets', [WorksheetController::class, 'store']);
        $router->put('/api/v1/admin/worksheets/{id}', [WorksheetController::class, 'update']);
        $router->delete('/api/v1/admin/worksheets/{id}', [WorksheetController::class, 'destroy']);

        // ===== MEDIA ROUTES =====
        $router->post('/api/v1/media/upload', [MediaController::class, 'upload']);
        $router->delete('/api/v1/admin/media/{id}', [MediaController::class, 'destroy']);
        $router->get('/api/v1/admin/media', [MediaController::class, 'index']);

        // ===== CONTACT & NEWSLETTER =====
        $router->post('/api/v1/contact', [ContactController::class, 'send']);
        $router->post('/api/v1/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
        $router->post('/api/v1/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

        // ===== SETTINGS & SEO =====
        $router->get('/api/v1/settings', [SettingsController::class, 'getAll']);
        $router->put('/api/v1/admin/settings/{key}', [SettingsController::class, 'update']);

        $router->get('/api/v1/seo/{slug}', [SeoController::class, 'getBySlug']);
        $router->post('/api/v1/admin/seo', [SeoController::class, 'store']);
        $router->put('/api/v1/admin/seo/{id}', [SeoController::class, 'update']);

        // ===== DASHBOARD ROUTES =====
        $router->get('/api/v1/admin/dashboard/stats', [DashboardController::class, 'stats']);
        $router->get('/api/v1/admin/dashboard/charts/episodes', [DashboardController::class, 'episodesChart']);
        $router->get('/api/v1/admin/dashboard/charts/downloads', [DashboardController::class, 'downloadsChart']);
        $router->get('/api/v1/admin/dashboard/recent-items', [DashboardController::class, 'recentItems']);
    }
}