<?php

namespace Nabta\Models;

/**
 * Category Model
 */
class Category extends BaseModel
{
    protected string $table = 'categories';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'type',
        'name_ar',
        'name_en',
        'slug',
        'description_ar',
        'description_en',
        'icon_url',
        'color_code',
        'display_order',
        'is_active',
        'created_at',
        'updated_at'
    ];

    /**
     * Get active categories
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE is_active = 1 ORDER BY display_order ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get by type
     */
    public function getByType(string $type): array
    {
        $sql = "SELECT * FROM {$this->table} 
                WHERE type = :type AND is_active = 1 
                ORDER BY display_order ASC";
        
        return $this->db->fetchAll($sql, ['type' => $type]);
    }

    /**
     * Get category with items count
     */
    public function getWithCounts(): array
    {
        $sql = "SELECT 
                    c.*,
                    (SELECT COUNT(*) FROM episodes WHERE category_id = c.id AND is_published = 1) as episodes_count,
                    (SELECT COUNT(*) FROM applications WHERE category_id = c.id) as apps_count,
                    (SELECT COUNT(*) FROM worksheets WHERE category_id = c.id) as worksheets_count
                FROM {$this->table} c
                WHERE c.is_active = 1
                ORDER BY c.display_order ASC";
        
        return $this->db->fetchAll($sql);
    }

    /**
     * Check if slug exists
     */
    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE slug = :slug";
        $params = ['slug' => $slug];

        if ($excludeId) {
            $sql .= " AND id != :id";
            $params['id'] = $excludeId;
        }

        $result = $this->db->fetch($sql, $params);
        return ($result['count'] ?? 0) > 0;
    }
}
