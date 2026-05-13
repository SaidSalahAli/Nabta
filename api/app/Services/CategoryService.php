<?php

namespace Nabta\Services;

use Nabta\Models\Category;
use Nabta\Helpers;

/**
 * Category Service
 */
class CategoryService
{
    private Category $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    /**
     * Get all active categories with counts
     */
    public function getAll(): array
    {
        return $this->categoryModel->getWithCounts();
    }

    /**
     * Get by type
     */
    public function getByType(string $type): array
    {
        return $this->categoryModel->getByType($type);
    }

    /**
     * Create category
     */
    public function create(array $data): array
    {
        // Validate required fields
        $required = ['type', 'name_ar', 'name_en'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return [
                    'success' => false,
                    'message' => "Field {$field} is required",
                    'errors' => null
                ];
            }
        }

        // Validate type
        $validTypes = ['episodes', 'applications', 'worksheets'];
        if (!in_array($data['type'], $validTypes)) {
            return [
                'success' => false,
                'message' => 'Invalid category type',
                'errors' => null
            ];
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Helpers\generateSlug($data['name_ar']);
        }

        // Check slug uniqueness
        if ($this->categoryModel->slugExists($data['slug'])) {
            return [
                'success' => false,
                'message' => 'Slug already exists',
                'errors' => null
            ];
        }

        // Set timestamps
        $data['created_at'] = Helpers\getCurrentTimestamp();
        $data['updated_at'] = Helpers\getCurrentTimestamp();

        $categoryId = $this->categoryModel->create($data);

        if (!$categoryId) {
            return [
                'success' => false,
                'message' => 'Failed to create category',
                'errors' => null
            ];
        }

        $category = $this->categoryModel->find($categoryId);

        return [
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ];
    }

    /**
     * Update category
     */
    public function update(int $categoryId, array $data): array
    {
        if (!$this->categoryModel->exists($categoryId)) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'errors' => null
            ];
        }

        $data['updated_at'] = Helpers\getCurrentTimestamp();

        if ($this->categoryModel->update($categoryId, $data)) {
            $category = $this->categoryModel->find($categoryId);
            return [
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to update category',
            'errors' => null
        ];
    }

    /**
     * Delete category
     */
    public function delete(int $categoryId): array
    {
        if (!$this->categoryModel->exists($categoryId)) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'errors' => null
            ];
        }

        if ($this->categoryModel->delete($categoryId)) {
            return [
                'success' => true,
                'message' => 'Category deleted successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to delete category',
            'errors' => null
        ];
    }
}
