<?php

namespace Nabta\Controllers;

use Nabta\Services\EpisodeService;

/**
 * Episode Controller
 */
class EpisodeController extends BaseController
{
    private EpisodeService $episodeService;

    public function __construct()
    {
        parent::__construct();
        $this->episodeService = new EpisodeService();
    }

    /**
     * Get all episodes
     * GET /api/v1/episodes
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $pagination = $this->getPagination();
        $result = $this->episodeService->getAll($pagination['page'], $pagination['per_page']);

$this->success($result['data'], '', 200);  
  }

    /**
     * Get featured episodes
     * GET /api/v1/episodes/featured
     */
    public function featured(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $limit = (int)$this->query('limit', 10);
        $result = $this->episodeService->getFeatured($limit);

        $this->success($result);
    }

    /**
     * Get episode by slug
     * GET /api/v1/episodes/{slug}
     */
    public function show(string $slug): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->episodeService->getBySlug($slug);

        if (!$result['success']) {
            $this->notFound();
        }

        $this->success($result['data']);
    }

    /**
     * Get episodes by category
     * GET /api/v1/episodes/category/{categoryId}
     */
    public function byCategory(int $categoryId): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $pagination = $this->getPagination();
        $result = $this->episodeService->getByCategory(
            $categoryId,
            $pagination['page'],
            $pagination['per_page']
        );

        $this->success($result);
    }

    /**
     * Search episodes
     * GET /api/v1/episodes/search
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
        $result = $this->episodeService->search(
            $query,
            $pagination['page'],
            $pagination['per_page']
        );

        $this->success($result);
    }

    /**
     * Create episode (Admin only)
     * POST /api/v1/episodes
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

        // TODO: Check user role (should be admin/editor)

        $result = $this->episodeService->create($this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Update episode (Admin only)
     * PUT /api/v1/episodes/{id}
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

        // TODO: Check user role (should be admin/editor)

        $result = $this->episodeService->update($id, $this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Delete episode (Admin only)
     * DELETE /api/v1/episodes/{id}
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

        // TODO: Check user role (should be admin)

        $result = $this->episodeService->delete($id);

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Get series episodes
     * GET /api/v1/series/{seriesId}/episodes
     */
    public function seriesEpisodes(int $seriesId): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->episodeService->getSeriesEpisodes($seriesId);

        if (empty($result)) {
            $this->notFound();
        }

        $this->success($result);
    }
}
