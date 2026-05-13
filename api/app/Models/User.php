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
     * Find user by email
     */
    public function findByEmail(string $email)
    {
        return $this->where('email', '=', $email)[0] ?? null;
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
