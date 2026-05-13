<?php

namespace Nabta\Controllers;

/**
 * SEO Controller
 */
class SeoController extends BaseController
{
    /**
     * Get all SEO pages
     * GET /api/v1/seo/pages
     */
    public function getPages(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        // TODO: Fetch from database
        $this->success([]);
    }

    /**
     * Create SEO page
     * POST /api/v1/seo/pages
     */
    public function createPage(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        $rules = [
            'slug' => 'required',
            'title' => 'required'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        // TODO: Save to database
        $this->success([], 'SEO page created successfully', 201);
    }

    /**
     * Update SEO page
     * PUT /api/v1/seo/pages/{id}
     */
    public function updatePage(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        // TODO: Update in database
        $this->success([], 'SEO page updated successfully');
    }
}
