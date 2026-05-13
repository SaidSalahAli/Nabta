<?php

namespace Nabta\Controllers;

use Nabta\Services\ApplicationService;

/**
 * Application Controller
 */
class ApplicationController extends BaseController
{
    private ApplicationService $applicationService;

    public function __construct()
    {
        parent::__construct();
        $this->applicationService = new ApplicationService();
    }

    /**
     * Get all applications
     * GET /api/v1/applications
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $pagination = $this->getPagination();
        $result = $this->applicationService->getAll($pagination['page'], $pagination['per_page']);

        $this->success($result['data']);
    }

    /**
     * Get featured applications
     * GET /api/v1/applications/featured
     */
    public function featured(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $limit = (int)$this->query('limit', 10);
        $result = $this->applicationService->getFeatured($limit);

        $this->success($result);
    }

    /**
     * Get application by slug
     * GET /api/v1/applications/{slug}
     */
    public function show(string $slug): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->applicationService->getBySlug($slug);

        if (!$result['success']) {
            $this->notFound();
        }

        $this->success($result['data']);
    }

    /**
     * Search applications
     * GET /api/v1/applications/search
     */
    public function search(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $query = $this->query('q');

        if (empty($query)) {
            $this->error('Search query is required', null, 400);
        }

        $pagination = $this->getPagination();
        $result = $this->applicationService->search(
            $query,
            $pagination['page'],
            $pagination['per_page']
        );

        $this->success($result);
    }

    /**
     * Create application
     * POST /api/v1/applications
     */
    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        $result = $this->applicationService->create($this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Update application
     * PUT /api/v1/applications/{id}
     */
    public function update(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        $result = $this->applicationService->update($id, $this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Delete application
     * DELETE /api/v1/applications/{id}
     */
    public function destroy(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        $result = $this->applicationService->delete($id);

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }
}
