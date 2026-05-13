<?php

namespace Nabta\Models;

/**
 * Worksheet Model
 */
class Worksheet extends BaseModel
{
    protected string $table = 'worksheets';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'category_id',
        'title_ar',
        'title_en',
        'slug',
        'description_ar',
        'description_en',
        'thumbnail_url',
        'pdf_url',
        'grade_level',
        'subject',
        'downloads_count',
        'is_free',
        'is_printable',
        'is_published',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'created_at',
        'updated_at'
    ];

    /**
     * Get free worksheets
     */
    public function getFreeWorksheets(int $limit = 15, int $offset = 0): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_free = 1 AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return $this->db->fetchAll($sql, [
            'limit' => $limit,
            'offset' => $offset
        ]);
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
     * Get by grade level
     */
    public function getByGrade(string $gradeLevel, int $limit = 15, int $offset = 0): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE grade_level = :grade_level AND is_published = 1
                ORDER BY published_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return $this->db->fetchAll($sql, [
            'grade_level' => $gradeLevel,
            'limit' => $limit,
            'offset' => $offset
        ]);
    }

    /**
     * Get most downloaded
     */
    public function getMostDownloaded(int $limit = 10): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_published = 1
                ORDER BY downloads_count DESC 
                LIMIT :limit";
        
        return $this->db->fetchAll($sql, ['limit' => $limit]);
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(int $worksheetId): bool
    {
        $sql = "UPDATE {$this->table} SET downloads_count = downloads_count + 1 WHERE id = :id";
        $stmt = $this->db->query($sql, ['id' => $worksheetId]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Log download
     */
    public function logDownload(int $worksheetId, ?int $userId = null): bool
    {
        $sql = "INSERT INTO worksheet_download_logs (worksheet_id, user_id, downloaded_at) 
                VALUES (:worksheet_id, :user_id, NOW())";
        
        $stmt = $this->db->query($sql, [
            'worksheet_id' => $worksheetId,
            'user_id' => $userId
        ]);
        
        return $stmt->rowCount() > 0;
    }

    /**
     * Search worksheets
     */
    public function searchWorksheets(string $query, int $limit = 15, int $offset = 0): array
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
