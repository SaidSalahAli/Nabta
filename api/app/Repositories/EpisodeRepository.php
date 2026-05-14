<?php

namespace Nabta\Repositories;

use Nabta\Models\Episode;

/**
 * Episode Repository
 *
 * @extends BaseRepository<Episode>
 */
class EpisodeRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Episode());
    }

    public function getByCategory(int $categoryId, int $page = 1, int $perPage = 15): array
    {
        $offset   = ($page - 1) * $perPage;
        $episodes = $this->model->getByCategory($categoryId, $perPage, $offset);

        return [
            'data'       => $episodes,
            'pagination' => [
                'current_page' => $page,
                'per_page'     => $perPage,
                'total_items'  => count($episodes),
            ],
        ];
    }

    public function getFeatured(int $limit = 10): array
    {
        return $this->model->getFeatured($limit);
    }

    public function getSeriesEpisodes(int $seriesId): array
    {
        return $this->model->getSeriesEpisodes($seriesId);
    }

    public function incrementViews(int $episodeId): bool
    {
        return $this->model->incrementViews($episodeId);
    }

    public function getRelated(int $episodeId, int $limit = 5): array
    {
        return $this->model->getRelated($episodeId, $limit);
    }

public function searchEpisodes(string $query, int $page = 1, int $perPage = 15): array
    {
        $offset   = ($page - 1) * $perPage;
        $episodes = $this->model->searchEpisodes($query, $perPage, $offset);

        return [
            'data'       => $episodes,
            'pagination' => [
                'current_page' => $page,
                'per_page'     => $perPage,
                'total_items'  => count($episodes),
            ],
        ];
    }

    public function withCategory(): array
    {
        return $this->model->withCategory();
    }
}