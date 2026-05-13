<?php

namespace Nabta\Controllers;

use Nabta\Services\MediaService;

/**
 * Media Controller
 */
class MediaController extends BaseController
{
    private MediaService $mediaService;

    public function __construct()
    {
        parent::__construct();
        $this->mediaService = new MediaService();
    }

    /**
     * Upload media
     * POST /api/v1/media/upload
     */
    public function upload(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        if (!isset($_FILES['file'])) {
            $this->error('No file provided', null, 400);
        }

        $result = $this->mediaService->upload($_FILES['file'], $userId);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Get media
     * GET /api/v1/media/{id}
     */
    public function show(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $result = $this->mediaService->getById($id);

        if (!$result) {
            $this->notFound();
        }

        $this->success($result);
    }

    /**
     * Delete media
     * DELETE /api/v1/media/{id}
     */
    public function delete(int $id): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        $result = $this->mediaService->delete($id, $userId);

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }
}
