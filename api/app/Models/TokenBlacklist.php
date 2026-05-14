<?php

namespace Nabta\Models;

/**
 * Token Blacklist Model
 */
class TokenBlacklist extends BaseModel
{
    protected string $table = 'token_blacklist';
    protected string $primaryKey = 'id';
    protected array $fillable = [
        'token',
        'user_id',
        'expires_at'
    ];

    /**
     * Check if token is blacklisted
     */
    public function tokenExists(string $token): bool
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE token = :token AND expires_at > NOW()";
        $result = $this->db->fetch($sql, ['token' => $token]);
        return ($result['count'] ?? 0) > 0;
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
}
