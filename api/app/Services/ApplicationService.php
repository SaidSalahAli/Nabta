<?php

namespace Nabta\Services;

use Nabta\Models\Application;
use Nabta\Models\Category;
use Nabta\Helpers;

/**
 * Application Service
 */
class ApplicationService
{
    private Application $applicationModel;
    private Category $categoryModel;

    public function __construct()
    {
        $this->applicationModel = new Application();
        $this->categoryModel = new Category();
    }

    /**
     * Get all applications paginated
     */
    public function getAll(int $page = 1, int $perPage = 15): array
    {
        return $this->applicationModel->paginate($page, $perPage);
    }

    /**
     * Get featured applications
     */
    public function getFeatured(int $limit = 10): array
    {
        return $this->applicationModel->getFeatured($limit);
    }

    /**
     * Get by slug
     */
    public function getBySlug(string $slug): array
    {
        $application = $this->applicationModel->findBySlug($slug);
        
        if (!$application) {
            return [
                'success' => false,
                'message' => 'Application not found',
                'data' => null
            ];
        }

        // Get gallery
        $gallery = $this->applicationModel->getWithGallery($application['id']);
        if ($gallery && isset($gallery['gallery'])) {
            $application['gallery'] = $gallery['gallery'];
        }

        return [
            'success' => true,
            'data' => $application
        ];
    }

    /**
     * Create application
     */
    public function create(array $data): array
    {
        // Validate required fields
        $required = ['title_ar', 'title_en', 'category_id'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return [
                    'success' => false,
                    'message' => "Field {$field} is required",
                    'errors' => null
                ];
            }
        }

        // Check category exists
        if (!$this->categoryModel->exists($data['category_id'])) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'errors' => null
            ];
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Helpers\generateSlug($data['title_ar']);
        }

        // Set timestamps
        $data['created_at'] = Helpers\getCurrentTimestamp();
        $data['updated_at'] = Helpers\getCurrentTimestamp();

        $appId = $this->applicationModel->create($data);

        if (!$appId) {
            return [
                'success' => false,
                'message' => 'Failed to create application',
                'errors' => null
            ];
        }

        $application = $this->applicationModel->find($appId);

        return [
            'success' => true,
            'message' => 'Application created successfully',
            'data' => $application
        ];
    }

    /**
     * Update application
     */
    public function update(int $appId, array $data): array
    {
        if (!$this->applicationModel->exists($appId)) {
            return [
                'success' => false,
                'message' => 'Application not found',
                'errors' => null
            ];
        }

        $data['updated_at'] = Helpers\getCurrentTimestamp();

        if ($this->applicationModel->update($appId, $data)) {
            $application = $this->applicationModel->find($appId);
            return [
                'success' => true,
                'message' => 'Application updated successfully',
                'data' => $application
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to update application',
            'errors' => null
        ];
    }

    /**
     * Delete application
     */
    public function delete(int $appId): array
    {
        if (!$this->applicationModel->exists($appId)) {
            return [
                'success' => false,
                'message' => 'Application not found',
                'errors' => null
            ];
        }

        if ($this->applicationModel->delete($appId)) {
            return [
                'success' => true,
                'message' => 'Application deleted successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to delete application',
            'errors' => null
        ];
    }

    /**
     * Search applications
     */
    public function search(string $query, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $applications = $this->applicationModel->searchApplications($query, $perPage, $offset);

        return [
            'data' => $applications,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => count($applications),
            ]
        ];
    }
}
