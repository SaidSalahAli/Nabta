<?php

namespace Nabta\Services;

use Nabta\Models\Worksheet;
use Nabta\Models\Category;
use Nabta\Helpers;

/**
 * Worksheet Service
 */
class WorksheetService
{
    private Worksheet $worksheetModel;
    private Category $categoryModel;

    public function __construct()
    {
        $this->worksheetModel = new Worksheet();
        $this->categoryModel = new Category();
    }

    /**
     * Get all worksheets paginated
     */
    public function getAll(int $page = 1, int $perPage = 15): array
    {
        return $this->worksheetModel->paginate($page, $perPage);
    }

    /**
     * Get free worksheets
     */
    public function getFreeWorksheets(int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $worksheets = $this->worksheetModel->getFreeWorksheets($perPage, $offset);

        return [
            'data' => $worksheets,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => count($worksheets),
            ]
        ];
    }

    /**
     * Get by slug
     */
    public function getBySlug(string $slug): array
    {
        $worksheet = $this->worksheetModel->findBySlug($slug);
        
        if (!$worksheet) {
            return [
                'success' => false,
                'message' => 'Worksheet not found',
                'data' => null
            ];
        }

        return [
            'success' => true,
            'data' => $worksheet
        ];
    }

    /**
     * Create worksheet
     */
    public function create(array $data): array
    {
        // Validate required fields
        $required = ['title_ar', 'title_en', 'category_id', 'pdf_url'];
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

        $worksheetId = $this->worksheetModel->create($data);

        if (!$worksheetId) {
            return [
                'success' => false,
                'message' => 'Failed to create worksheet',
                'errors' => null
            ];
        }

        $worksheet = $this->worksheetModel->find($worksheetId);

        return [
            'success' => true,
            'message' => 'Worksheet created successfully',
            'data' => $worksheet
        ];
    }

    /**
     * Update worksheet
     */
    public function update(int $worksheetId, array $data): array
    {
        if (!$this->worksheetModel->exists($worksheetId)) {
            return [
                'success' => false,
                'message' => 'Worksheet not found',
                'errors' => null
            ];
        }

        $data['updated_at'] = Helpers\getCurrentTimestamp();

        if ($this->worksheetModel->update($worksheetId, $data)) {
            $worksheet = $this->worksheetModel->find($worksheetId);
            return [
                'success' => true,
                'message' => 'Worksheet updated successfully',
                'data' => $worksheet
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to update worksheet',
            'errors' => null
        ];
    }

    /**
     * Delete worksheet
     */
    public function delete(int $worksheetId): array
    {
        if (!$this->worksheetModel->exists($worksheetId)) {
            return [
                'success' => false,
                'message' => 'Worksheet not found',
                'errors' => null
            ];
        }

        if ($this->worksheetModel->delete($worksheetId)) {
            return [
                'success' => true,
                'message' => 'Worksheet deleted successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to delete worksheet',
            'errors' => null
        ];
    }

    /**
     * Search worksheets
     */
    public function search(string $query, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $worksheets = $this->worksheetModel->searchWorksheets($query, $perPage, $offset);

        return [
            'data' => $worksheets,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => count($worksheets),
            ]
        ];
    }

    /**
     * Log download
     */
    public function logDownload(int $worksheetId, ?int $userId = null): array
    {
        $worksheet = $this->worksheetModel->find($worksheetId);

        if (!$worksheet) {
            return [
                'success' => false,
                'message' => 'Worksheet not found',
                'data' => null
            ];
        }

        // Log the download
        $this->worksheetModel->logDownload($worksheetId, $userId);

        // Increment download count
        $this->worksheetModel->incrementDownloads($worksheetId);

        return [
            'success' => true,
            'message' => 'Download logged successfully',
            'data' => [
                'worksheet_id' => $worksheetId,
                'pdf_url' => $worksheet['pdf_url'],
                'downloaded_at' => Helpers\getCurrentTimestamp()
            ]
        ];
    }
}
