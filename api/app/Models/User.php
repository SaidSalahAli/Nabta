<?php

namespace Nabta\Models;

/**
 * User Model
 */
class User extends BaseModel
{
    protected string $table = 'users';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'country',
        'city',
        'avatar_url',
        'bio',
        'is_verified',
        'is_active',
        'last_login_at',
        'created_at',
        'updated_at'
    ];
    protected array $hidden = ['password'];

    /**
     * Find user by email with role
     */
    public function findByEmailWithRole(string $email)
    {
        $sql = "SELECT u.*, r.name as role 
                FROM {$this->table} u 
                LEFT JOIN user_roles ur ON u.id = ur.user_id 
                LEFT JOIN roles r ON ur.role_id = r.id 
                WHERE u.email = :email 
                LIMIT 1";
        return $this->db->fetch($sql, ['email' => $email]);
    }

    /**
     * Find user by ID with role
     */
    public function findWithRole(int $id)
    {
        $sql = "SELECT u.*, r.name as role 
                FROM {$this->table} u 
                LEFT JOIN user_roles ur ON u.id = ur.user_id 
                LEFT JOIN roles r ON ur.role_id = r.id 
                WHERE u.{$this->primaryKey} = :id 
                LIMIT 1";
        return $this->db->fetch($sql, ['id' => $id]);
    }

    /**
     * Update last login
     */
    public function updateLastLogin(int $userId): bool
    {
        $sql = "UPDATE {$this->table} SET last_login_at = NOW() WHERE id = :id";
        $stmt = $this->db->query($sql, ['id' => $userId]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Get user statistics
     */
    public function getStatistics(int $userId): array
    {
        $sql = "SELECT 
                    (SELECT COUNT(*) FROM worksheet_download_logs WHERE user_id = :user_id) as downloaded_worksheets
                FROM users WHERE id = :user_id";
        
        $result = $this->db->fetch($sql, ['user_id' => $userId]);
        return $result ?? [];
    }

    /**
     * Check if email exists
     */
    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE email = :email";
        $params = ['email' => $email];

        if ($excludeId) {
            $sql .= " AND id != :id";
            $params['id'] = $excludeId;
        }

        $result = $this->db->fetch($sql, $params);
        return ($result['count'] ?? 0) > 0;
    }
}
