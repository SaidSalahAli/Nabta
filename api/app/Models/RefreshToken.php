<?php

namespace Nabta\Models;

/**
 * Refresh Token Model
 */
class RefreshToken extends BaseModel
{
    protected string $table = 'refresh_tokens';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'user_id',
        'token',
        'ip_address',
        'user_agent',
        'expires_at'
    ];

    /**
     * Check if refresh token exists
     */
    public function tokenExists(string $token): bool
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE token = :token AND expires_at > NOW()";
        $result = $this->db->fetch($sql, ['token' => $token]);
        return ($result['count'] ?? 0) > 0;
    }

    /**
     * Delete refresh token by token string
     */
    public function deleteByToken(string $token): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE token = :token";
        $stmt = $this->db->query($sql, ['token' => $token]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Delete all user refresh tokens
     */
    public function deleteByUserId(int $userId): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->db->query($sql, ['user_id' => $userId]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Delete expired tokens
     */
    public function deleteExpired(): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE expires_at < NOW()";
        $this->db->query($sql);
        return true;
    }

    /**
     * Find by user and IP (for session management)
     */
    public function findByUserAndIp(int $userId, string $ipAddress): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = :user_id AND ip_address = :ip_address AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1";
        return $this->db->fetch($sql, ['user_id' => $userId, 'ip_address' => $ipAddress]);
    }
}
