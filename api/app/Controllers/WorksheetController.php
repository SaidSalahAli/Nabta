<?php

namespace Nabta\Controllers;

use Nabta\Services\WorksheetService;

/**
 * Worksheet Controller
 */
class WorksheetController extends BaseController
{
    private WorksheetService $worksheetService;

    public function __construct()
    {
        parent::__construct();
        $this->worksheetService = new WorksheetService();
    }

    /**
     * Get all worksheets
     * GET /api/v1/worksheets
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $pagination = $this->getPagination();
        $result = $this->worksheetService->getAll($pagination['page'], $pagination['per_page']);

        $this->success($result['data']);
    }

    /**
     * Get free worksheets
     * GET /api/v1/worksheets/free
     */
    public function free(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $pagination = $this->getPagination();
        $result = $this->worksheetService->getFreeWorksheets($pagination['page'], $pagination['per_page']);

        $this->success($result);
    }

    /**
     * Get worksheet by slug
     * GET /api/v1/worksheets/{slug}
     */
    public function show(string $slug): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->worksheetService->getBySlug($slug);

        if (!$result['success']) {
            $this->notFound();
        }

        $this->success($result['data']);
    }

    /**
     * Download worksheet
     * POST /api/v1/worksheets/{id}/download
     */
    public function download(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();

        $result = $this->worksheetService->logDownload($id, $userId);

        if ($result['success']) {
            $this->success($result['data'], 'Download logged successfully');
        } else {
            $this->error($result['message'], null, 404);
        }
    }

    /**
     * Search worksheets
     * GET /api/v1/worksheets/search
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
        $result = $this->worksheetService->search(
            $query,
            $pagination['page'],
            $pagination['per_page']
        );

        $this->success($result);
    }

    /**
     * Create worksheet
     * POST /api/v1/worksheets
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

        $result = $this->worksheetService->create($this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Update worksheet
     * PUT /api/v1/worksheets/{id}
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

        $result = $this->worksheetService->update($id, $this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Delete worksheet
     * DELETE /api/v1/worksheets/{id}
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

        $result = $this->worksheetService->delete($id);

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }
}
