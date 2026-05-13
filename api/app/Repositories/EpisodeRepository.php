<?php

namespace Nabta\Repositories;

use Nabta\Models\Episode;

/**
 * Episode Repository
 */
class EpisodeRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Episode());
    }

    /**
     * Get by category
     */
    public function getByCategory(int $categoryId, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $episodes = $this->model->getByCategory($categoryId, $perPage, $offset);
        
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
     * Get featured
     */
    public function getFeatured(int $limit = 10): array
    {
        return $this->model->getFeatured($limit);
    }

    /**
     * Get series episodes
     */
    public function getSeriesEpisodes(int $seriesId): array
    {
        return $this->model->getSeriesEpisodes($seriesId);
    }

    /**
     * Increment views
     */
    public function incrementViews(int $episodeId): bool
    {
        return $this->model->incrementViews($episodeId);
    }

    /**
     * Get related
     */
    public function getRelated(int $episodeId, int $limit = 5): array
    {
        return $this->model->getRelated($episodeId, $limit);
    }

    /**
     * Search
     */
    public function search(string $query, int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        $episodes = $this->model->searchEpisodes($query, $perPage, $offset);
        
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
     * Get with category
     */
    public function withCategory()
    {
        return $this->model->withCategory();
    }
}
