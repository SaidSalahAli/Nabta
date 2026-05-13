<?php

namespace Nabta\Models;

/**
 * Application Model
 */
class Application extends BaseModel
{
    protected string $table = 'applications';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'category_id',
        'title_ar',
        'title_en',
        'slug',
        'description_ar',
        'description_en',
        'full_content_ar',
        'full_content_en',
        'icon_url',
        'google_play_url',
        'app_store_url',
        'website_url',
        'version',
        'downloads_count',
        'rating',
        'is_featured',
        'is_published',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'created_at',
        'updated_at'
    ];

    /**
     * Get featured applications
     */
    public function getFeatured(int $limit = 10): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_featured = 1 AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit";
        
        return $this->db->fetchAll($sql, ['limit' => $limit]);
    }

    /**
     * Get by category
     */
    public function getByCategory(int $categoryId, int $limit = 15, int $offset = 0): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE category_id = :category_id AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return $this->db->fetchAll($sql, [
            'category_id' => $categoryId,
            'limit' => $limit,
            'offset' => $offset
        ]);
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(int $appId): bool
    {
        $sql = "UPDATE {$this->table} SET downloads_count = downloads_count + 1 WHERE id = :id";
        $stmt = $this->db->query($sql, ['id' => $appId]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Get with gallery
     */
    public function getWithGallery(int $appId)
    {
        $app = $this->find($appId);
        if (!$app) {
            return null;
        }

        $sql = "SELECT * FROM application_gallery WHERE application_id = :app_id ORDER BY position ASC";
        $gallery = $this->db->fetchAll($sql, ['app_id' => $appId]);
        
        $app['gallery'] = $gallery;
        return $app;
    }

    /**
     * Get trending applications
     */
    public function getTrending(int $limit = 10): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_published = 1
                ORDER BY downloads_count DESC, rating DESC
                LIMIT :limit";
        
        return $this->db->fetchAll($sql, ['limit' => $limit]);
    }

    /**
     * Search applications
     */
    public function searchApplications(string $query, int $limit = 15, int $offset = 0): array
    {
        $searchQuery = "%{$query}%";
        $sql = "SELECT * FROM {$this->table} 
                WHERE (title_ar LIKE :query OR title_en LIKE :query OR description_ar LIKE :query OR description_en LIKE :query) 
                AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return $this->db->fetchAll($sql, [
            'query' => $searchQuery,
            'limit' => $limit,
            'offset' => $offset
        ]);
    }
}
