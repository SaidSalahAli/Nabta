<?php

namespace Nabta\Controllers;

use Nabta\Services\CategoryService;

/**
 * Category Controller
 */
class CategoryController extends BaseController
{
    private CategoryService $categoryService;

    public function __construct()
    {
        parent::__construct();
        $this->categoryService = new CategoryService();
    }

    /**
     * Get all categories
     * GET /api/v1/categories
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->categoryService->getAll();
        $this->success($result);
    }

    /**
     * Get categories by type
     * GET /api/v1/categories/{type}
     */
    public function getByType(string $type): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $validTypes = ['episodes', 'applications', 'worksheets'];
        if (!in_array($type, $validTypes)) {
            $this->error('Invalid category type', null, 400);
        }

        $result = $this->categoryService->getByType($type);
        $this->success($result);
    }

    /**
     * Create category
     * POST /api/v1/categories
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

        $result = $this->categoryService->create($this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Update category
     * PUT /api/v1/categories/{id}
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

        $result = $this->categoryService->update($id, $this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Delete category
     * DELETE /api/v1/categories/{id}
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

        $result = $this->categoryService->delete($id);

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }
}
