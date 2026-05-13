<?php

namespace Nabta\Controllers;

/**
 * Dashboard Controller
 */
class DashboardController extends BaseController
{
    /**
     * Get dashboard statistics
     * GET /api/v1/dashboard/stats
     */
    public function stats(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        // TODO: Calculate statistics from database
        $this->success([
            'total_episodes' => 0,
            'total_applications' => 0,
            'total_worksheets' => 0,
            'total_users' => 0,
            'total_downloads' => 0
        ]);
    }

    /**
     * Get analytics data
     * GET /api/v1/dashboard/analytics
     */
    public function analytics(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        // TODO: Fetch analytics from database
        $this->success([
            'views_trend' => [],
            'downloads_trend' => [],
            'user_growth' => []
        ]);
    }
}
