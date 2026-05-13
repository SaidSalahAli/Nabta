<?php

namespace Nabta\Models;

use Nabta\Config\Database;

/**
 * Base Model - Parent class for all models
 */
abstract class BaseModel
{
    protected Database $db;
    protected string $table = '';
    protected string $primaryKey = 'id';
    protected array $fillable = [];
    protected array $hidden = [];
    protected array $casts = [];

    public function __construct()
    {
        $this->db = new Database();
    }

    /**
     * Find record by ID
     */
    public function find(int $id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1";
        return $this->db->fetch($sql, ['id' => $id]);
    }

    /**
     * Find by slug
     */
    public function findBySlug(string $slug)
    {
        $sql = "SELECT * FROM {$this->table} WHERE slug = :slug LIMIT 1";
        return $this->db->fetch($sql, ['slug' => $slug]);
    }

    /**
     * Get all records
     */
    public function all(?int $limit = null, int $offset = 0): array
    {
        $sql = "SELECT * FROM {$this->table}";
        
        if ($limit) {
            $sql .= " LIMIT :limit OFFSET :offset";
            return $this->db->fetchAll($sql, ['limit' => $limit, 'offset' => $offset]);
        }

        return $this->db->fetchAll($sql);
    }

    /**
     * Get paginated records
     */
    public function paginate(int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM {$this->table}";
        $countResult = $this->db->fetch($countSql);
        $total = $countResult['total'] ?? 0;

        // Get records
        $sql = "SELECT * FROM {$this->table} LIMIT :limit OFFSET :offset";
        $records = $this->db->fetchAll($sql, ['limit' => $perPage, 'offset' => $offset]);

        return [
            'data' => $records,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => ceil($total / $perPage),
                'from' => $offset + 1,
                'to' => min($offset + $perPage, $total),
            ]
        ];
    }

    /**
     * Create new record
     */
    public function create(array $data): int|bool
    {
        $data = $this->filterFillable($data);
        
        if (empty($data)) {
            return false;
        }

        $fields = array_keys($data);
        $placeholders = array_map(fn($f) => ":{$f}", $fields);
        
        $sql = "INSERT INTO {$this->table} (" . implode(',', $fields) . ") 
                VALUES (" . implode(',', $placeholders) . ")";

        $stmt = $this->db->query($sql, $data);
        
        return $stmt->rowCount() > 0 ? (int)$this->db->lastInsertId() : false;
    }

    /**
     * Update record
     */
    public function update(int $id, array $data): bool
    {
        $data = $this->filterFillable($data);
        
        if (empty($data)) {
            return false;
        }

        $sets = array_map(fn($f) => "{$f} = :{$f}", array_keys($data));
        $data[$this->primaryKey] = $id;

        $sql = "UPDATE {$this->table} SET " . implode(', ', $sets) . 
               " WHERE {$this->primaryKey} = :{$this->primaryKey}";

        $stmt = $this->db->query($sql, $data);
        return $stmt->rowCount() > 0;
    }

    /**
     * Delete record
     */
    public function delete(int $id): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id";
        $stmt = $this->db->query($sql, ['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Filter data by fillable columns
     */
    protected function filterFillable(array $data): array
    {
        if (empty($this->fillable)) {
            return $data;
        }

        return array_filter(
            $data,
            fn($key) => in_array($key, $this->fillable),
            ARRAY_FILTER_USE_KEY
        );
    }

    /**
     * Check if record exists
     */
    public function exists(int $id): bool
    {
        return $this->find($id) !== false;
    }

    /**
     * Count total records
     */
    public function count(): int
    {
        $sql = "SELECT COUNT(*) as total FROM {$this->table}";
        $result = $this->db->fetch($sql);
        return $result['total'] ?? 0;
    }

    /**
     * Get database instance
     */
    public function getDb(): Database
    {
        return $this->db;
    }

    /**
     * Search in multiple fields
     */
    public function search(string $query, array $fields): array
    {
        $conditions = array_map(
            fn($f) => "{$f} LIKE :query",
            $fields
        );

        $sql = "SELECT * FROM {$this->table} WHERE " . implode(' OR ', $conditions);
        $query = "%{$query}%";
        
        $params = array_fill_keys($fields, $query);
        return $this->db->fetchAll($sql, $params);
    }

    /**
     * Filter records
     */
    public function where(string $field, $operator, $value): array
    {
        if (is_array($value)) {
            $placeholders = array_map(fn($k) => ":{$k}", array_keys($value));
            $sql = "SELECT * FROM {$this->table} WHERE {$field} IN (" . implode(',', $placeholders) . ")";
            return $this->db->fetchAll($sql, $value);
        }

        $sql = "SELECT * FROM {$this->table} WHERE {$field} {$operator} :value";
        return $this->db->fetchAll($sql, ['value' => $value]);
    }

    /**
     * Get table name
     */
    public function getTable(): string
    {
        return $this->table;
    }
}
