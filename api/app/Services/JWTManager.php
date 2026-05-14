<?php

namespace Nabta\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Nabta\Models\TokenBlacklist;
use Nabta\Models\RefreshToken;

/**
 * JWT Token Manager Service
 * Handles JWT token generation, validation, and management
 */
class JWTManager
{
    private string $secret;
    private int $expiration;
    private int $refreshExpiration;
    private TokenBlacklist $blacklistModel;
    private RefreshToken $refreshTokenModel;

    public function __construct()
    {
        $this->secret = \Nabta\Config\Config::get('JWT_SECRET', 'your-secret-key-change-in-production');
        $this->expiration = (int)\Nabta\Config\Config::get('JWT_EXPIRATION', 3600);
        $this->refreshExpiration = (int)\Nabta\Config\Config::get('JWT_REFRESH_EXPIRATION', 604800);
        $this->blacklistModel = new TokenBlacklist();
        $this->refreshTokenModel = new RefreshToken();
    }

    /**
     * Generate Access Token
     */
    public function generateAccessToken(int $userId, array $userData = []): string
    {
        $issuedAt = time();
        $expire = $issuedAt + $this->expiration;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'type' => 'access',
            'id' => $userId,
            'email' => $userData['email'] ?? '',
            'name' => $userData['name'] ?? '',
            'role' => $userData['role'] ?? 'user',
            'permissions' => $userData['permissions'] ?? []
        ];

        try {
            return JWT::encode($payload, $this->secret, 'HS256');
        } catch (\Exception $e) {
            error_log('JWT Generation Error: ' . $e->getMessage());
            throw new \Exception('Failed to generate token');
        }
    }

    /**
     * Generate Refresh Token
     */
    public function generateRefreshToken(int $userId, string $ipAddress = '', string $userAgent = ''): string
    {
        $issuedAt = time();
        $expire = $issuedAt + $this->refreshExpiration;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'type' => 'refresh',
            'jti' => bin2hex(random_bytes(16)) // Unique token identifier
        ];

        try {
            $token = JWT::encode($payload, $this->secret, 'HS256');
            
            // Store refresh token in database
            $this->refreshTokenModel->create([
                'user_id' => $userId,
                'token' => $token,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'expires_at' => date('Y-m-d H:i:s', $expire)
            ]);

            return $token;
        } catch (\Exception $e) {
            error_log('Refresh Token Generation Error: ' . $e->getMessage());
            throw new \Exception('Failed to generate refresh token');
        }
    }

    /**
     * Verify Token
     */
    public function verifyToken(string $token): ?array
    {
        try {
            // Check if token is blacklisted
            if ($this->blacklistModel->tokenExists($token)) {
                return null;
            }

            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return (array)$decoded;
        } catch (ExpiredException $e) {
            error_log('Token Expired: ' . $e->getMessage());
            return null;
        } catch (SignatureInvalidException $e) {
            error_log('Invalid Token Signature: ' . $e->getMessage());
            return null;
        } catch (\Exception $e) {
            error_log('Token Verification Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Decode Token Without Validation
     */
    public function decodeToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return (array)$decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Blacklist Token (for logout)
     */
    public function blacklistToken(string $token): bool
    {
        try {
            $decoded = $this->decodeToken($token);
            if (!$decoded) {
                return false;
            }

            return $this->blacklistModel->create([
                'token' => $token,
                'user_id' => $decoded['sub'] ?? null,
                'expires_at' => date('Y-m-d H:i:s', $decoded['exp'])
            ]);
        } catch (\Exception $e) {
            error_log('Blacklist Token Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if Token is Blacklisted
     */
    public function isBlacklisted(string $token): bool
    {
        return $this->blacklistModel->tokenExists($token);
    }

    /**
     * Refresh Access Token
     */
    public function refreshAccessToken(string $refreshToken, array $userData = []): ?string
    {
        try {
            $decoded = $this->verifyToken($refreshToken);
            
            if (!$decoded || ($decoded['type'] ?? null) !== 'refresh') {
                return null;
            }

            // Check if refresh token exists in database
            if (!$this->refreshTokenModel->tokenExists($refreshToken)) {
                return null;
            }

            // Generate new access token
            return $this->generateAccessToken($decoded['sub'], $userData);
        } catch (\Exception $e) {
            error_log('Refresh Token Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Revoke Refresh Token
     */
    public function revokeRefreshToken(string $refreshToken): bool
    {
        return $this->refreshTokenModel->deleteByToken($refreshToken);
    }

    /**
     * Revoke All User Tokens
     */
    public function revokeAllUserTokens(int $userId): bool
    {
        return $this->refreshTokenModel->deleteByUserId($userId);
    }

    /**
     * Clean Expired Tokens
     */
    public function cleanExpiredTokens(): bool
    {
        try {
            $this->blacklistModel->deleteExpired();
            $this->refreshTokenModel->deleteExpired();
            return true;
        } catch (\Exception $e) {
            error_log('Clean Expired Tokens Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get Token Expiration Time
     */
    public function getTokenExpiration(string $token): ?int
    {
        $decoded = $this->decodeToken($token);
        return $decoded['exp'] ?? null;
    }

    /**
     * Get Token User ID
     */
    public function getUserIdFromToken(string $token): ?int
    {
        $decoded = $this->decodeToken($token);
        return $decoded['sub'] ?? null;
    }

    /**
     * Is Token Expired
     */
    public function isTokenExpired(string $token): bool
    {
        $expiration = $this->getTokenExpiration($token);
        return $expiration ? $expiration < time() : true;
    }

    /**
     * Get Token Time Remaining
     */
    public function getTokenTimeRemaining(string $token): int
    {
        $expiration = $this->getTokenExpiration($token);
        $remaining = $expiration ? $expiration - time() : 0;
        return max(0, $remaining);
    }
}
