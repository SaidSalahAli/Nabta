<?php

namespace Nabta\Services;

use Nabta\Models\Episode;
use Nabta\Models\Category;
use Nabta\Helpers;

/**
 * Episode Service
 */
class EpisodeService
{
    private Episode $episodeModel;
    private Category $categoryModel;

    public function __construct()
    {
        $this->episodeModel = new Episode();
        $this->categoryModel = new Category();
    }

    /**
     * Get all episodes paginated
     */
    public function getAll(int $page = 1, int $perPage = 15): array
    {
        return $this->episodeModel->paginate($page, $perPage);
    }

    /**
     * Get featured episodes
     */
    public function getFeatured(int $limit = 10): array
    {
        return $this->episodeModel->getFeatured($limit);
    }

    /**
     * Get by category
     */
    public function getByCategory(int $categoryId, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $episodes = $this->episodeModel->getByCategory($categoryId, $perPage, $offset);
        
        $countSql = "SELECT COUNT(*) as total FROM episodes WHERE category_id = :category_id AND is_published = 1";
        $countResult = $this->episodeModel->getDb()->fetch($countSql, ['category_id' => $categoryId]);
        $total = $countResult['total'] ?? 0;

        return [
            'data' => $episodes,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => ceil($total / $perPage),
            ]
        ];
    }

    /**
     * Get by slug
     */
    public function getBySlug(string $slug): array
    {
        $episode = $this->episodeModel->findBySlug($slug);
        
        if (!$episode) {
            return [
                'success' => false,
                'message' => 'Episode not found',
                'data' => null
            ];
        }

        // Increment views
        $this->episodeModel->incrementViews($episode['id']);

        // Get related episodes
        $related = $this->episodeModel->getRelated($episode['id'], 5);

        $episode['related'] = $related;

        return [
            'success' => true,
            'data' => $episode
        ];
    }

    /**
     * Create episode
     */
    public function create(array $data): array
    {
        // Validate required fields
        $required = ['title_ar', 'title_en', 'category_id', 'youtube_url'];
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

        $episodeId = $this->episodeModel->create($data);

        if (!$episodeId) {
            return [
                'success' => false,
                'message' => 'Failed to create episode',
                'errors' => null
            ];
        }

        $episode = $this->episodeModel->find($episodeId);

        return [
            'success' => true,
            'message' => 'Episode created successfully',
            'data' => $episode
        ];
    }

    /**
     * Update episode
     */
    public function update(int $episodeId, array $data): array
    {
        if (!$this->episodeModel->exists($episodeId)) {
            return [
                'success' => false,
                'message' => 'Episode not found',
                'errors' => null
            ];
        }

        $data['updated_at'] = Helpers\getCurrentTimestamp();

        if ($this->episodeModel->update($episodeId, $data)) {
            $episode = $this->episodeModel->find($episodeId);
            return [
                'success' => true,
                'message' => 'Episode updated successfully',
                'data' => $episode
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to update episode',
            'errors' => null
        ];
    }

    /**
     * Delete episode
     */
    public function delete(int $episodeId): array
    {
        if (!$this->episodeModel->exists($episodeId)) {
            return [
                'success' => false,
                'message' => 'Episode not found',
                'errors' => null
            ];
        }

        if ($this->episodeModel->delete($episodeId)) {
            return [
                'success' => true,
                'message' => 'Episode deleted successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to delete episode',
            'errors' => null
        ];
    }

    /**
     * Search episodes
     */
    public function search(string $query, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $episodes = $this->episodeModel->searchEpisodes($query, $perPage, $offset);

        return [
            'data' => $episodes,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => count($episodes),
            ]
        ];
    }

    /**
     * Get series episodes
     */
    public function getSeriesEpisodes(int $seriesId): array
    {
        return $this->episodeModel->getSeriesEpisodes($seriesId);
    }
}
