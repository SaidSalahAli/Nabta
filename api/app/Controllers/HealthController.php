<?php

namespace Nabta\Controllers;

/**
 * Health Check Controller
 */
class HealthController extends BaseController
{
    /**
     * Health check endpoint
     */
    public function check(): void
    {
        $this->success([
            'status' => 'healthy',
            'api_version' => 'v1',
            'app_name' => 'Nabta Educational Platform',
            'timestamp' => date('Y-m-d H:i:s')
        ], 'API is running');
    }
}
