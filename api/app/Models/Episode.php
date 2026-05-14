<?php

namespace Nabta\Models;

/**
 * Episode Model
 */
class Episode extends BaseModel
{
    protected string $table = 'episodes';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'category_id',
        'series_id',
        'title_ar',
        'title_en',
        'slug',
        'short_description_ar',
        'short_description_en',
        'description_ar',
        'description_en',
        'thumbnail_url',
        'youtube_url',
        'author',
        'duration_seconds',
        'views_count',
        'is_featured',
        'is_published',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'created_at',
        'updated_at'
    ];

    public function getByCategory(int $categoryId, int $limit = 15, int $offset = 0): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE category_id = :category_id AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";

        return $this->db->fetchAll($sql, [
            'category_id' => $categoryId,
            'limit'       => $limit,
            'offset'      => $offset,
        ]);
    }

    public function getFeatured(int $limit = 10): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_featured = 1 AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit";

        return $this->db->fetchAll($sql, ['limit' => $limit]);
    }

    public function getSeriesEpisodes(int $seriesId): array
    {
        $sql = "SELECT e.* FROM {$this->table} e
                JOIN series_episodes se ON e.id = se.episode_id
                WHERE se.series_id = :series_id AND e.is_published = 1
                ORDER BY se.order ASC";

        return $this->db->fetchAll($sql, ['series_id' => $seriesId]);
    }

    public function incrementViews(int $episodeId): bool
    {
        $sql = "UPDATE {$this->table} SET views_count = views_count + 1 WHERE id = :id";
        $stmt = $this->db->query($sql, ['id' => $episodeId]);
        return $stmt->rowCount() > 0;
    }

    public function getRelated(int $episodeId, int $limit = 5): array
    {
        $episode = $this->find($episodeId);
        if (!$episode) {
            return [];
        }

        $sql = "SELECT * FROM {$this->table} 
                WHERE category_id = :category_id AND id != :episode_id AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit";

        return $this->db->fetchAll($sql, [
            'category_id' => $episode['category_id'],
            'episode_id'  => $episodeId,
            'limit'       => $limit,
        ]);
    }

    public function searchEpisodes(string $query, int $limit = 15, int $offset = 0): array
    {
        $searchQuery = "%{$query}%";
        $sql = "SELECT * FROM {$this->table} 
                WHERE (title_ar LIKE :query OR title_en LIKE :query 
                    OR description_ar LIKE :query OR description_en LIKE :query) 
                AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";

        return $this->db->fetchAll($sql, [
            'query'  => $searchQuery,
            'limit'  => $limit,
            'offset' => $offset,
        ]);
    }

    public function withCategory(): array
    {
        $sql = "SELECT e.*, c.name_ar, c.name_en FROM {$this->table} e
                LEFT JOIN categories c ON e.category_id = c.id";
        return $this->db->fetchAll($sql);
    }
}