<?php

namespace Nabta\Controllers;

/**
 * Settings Controller
 */
class SettingsController extends BaseController
{
    /**
     * Get all settings
     * GET /api/v1/settings
     */
    public function getAll(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        // TODO: Fetch from database
        $this->success([
            'site_name' => 'Nabta Educational Platform',
            'site_url' => getenv('APP_URL'),
            'admin_email' => 'admin@nabta.com',
            'language' => 'ar'
        ]);
    }

    /**
     * Get single setting
     * GET /api/v1/settings/{key}
     */
    public function get(string $key): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        // TODO: Fetch from database
        $this->success(['key' => $key, 'value' => 'value']);
    }

    /**
     * Update setting
     * PUT /api/v1/settings/{key}
     */
    public function update(string $key): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        // TODO: Update in database
        $this->success(['key' => $key, 'value' => $this->input('value')], 'Setting updated successfully');
    }
}
