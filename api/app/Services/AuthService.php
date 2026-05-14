<?php

namespace Nabta\Services;

use Nabta\Models\User;
use Nabta\Helpers;

/**
 * Authentication Service
 */
class AuthService
{
    private User $userModel;
    private JWTManager $jwtManager;

    public function __construct()
    {
        $this->userModel = new User();
        $this->jwtManager = new JWTManager();
    }

    /**
     * Register new user
     */
    public function register(array $data): array
    {
        // Validate email
        if ($this->userModel->emailExists($data['email'])) {
            return [
                'success' => false,
                'message' => 'Email already registered',
                'errors' => ['email' => 'Email already in use']
            ];
        }

        // Hash password
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Helpers\hashPassword($data['password']),
            'is_active' => true,
            'created_at' => Helpers\getCurrentTimestamp(),
            'updated_at' => Helpers\getCurrentTimestamp()
        ];

        $userId = $this->userModel->create($userData);

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'Registration failed',
                'errors' => null
            ];
        }

        $user = $this->userModel->find($userId);
        unset($user['password']);

        $clientIp = $this->getUserIpAddress();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return [
            'success' => true,
            'message' => 'User registered successfully',
            'data' => $user,
            'token' => $this->jwtManager->generateAccessToken($userId, [
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => 'user'
            ]),
            'refreshToken' => $this->jwtManager->generateRefreshToken(
                $userId,
                $clientIp,
                $userAgent
            )
        ];
    }

    /**
     * Login user
     */
    public function login(string $email, string $password): array
    {
        $user = $this->userModel->findByEmailWithRole($email);

        if (!$user || !Helpers\verifyPassword($password, $user['password'])) {
            Helpers\logInfo('Failed login attempt', ['email' => $email]);
            return [
                'success' => false,
                'message' => 'Invalid credentials',
                'errors' => null
            ];
        }

        if (!$user['is_active']) {
            return [
                'success' => false,
                'message' => 'Account is inactive',
                'errors' => null
            ];
        }

        // Update last login
        $this->userModel->updateLastLogin($user['id']);

        unset($user['password']);

        $clientIp = $this->getUserIpAddress();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        return [
            'success' => true,
            'message' => 'Login successful',
            'data' => $user,
            'token' => $this->jwtManager->generateAccessToken($user['id'], [
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'] ?? 'user'
            ]),
            'refreshToken' => $this->jwtManager->generateRefreshToken(
                $user['id'],
                $clientIp,
                $userAgent
            )
        ];
    }

    /**
     * Verify email (stub for future implementation)
     */
    public function verifyEmail(string $token): array
    {
        // Implement email verification logic
        return [
            'success' => true,
            'message' => 'Email verified successfully'
        ];
    }

    /**
     * Generate JWT token
     */
    public function generateToken(int $userId): string
    {
        $issuedAt = time();
        $expire = $issuedAt + (int)getenv('JWT_EXPIRATION');
        $secret = getenv('JWT_SECRET');

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
        ];

        try {
            return \Firebase\JWT\JWT::encode($payload, $secret, 'HS256');
        } catch (\Exception $e) {
            Helpers\logError('JWT Generation Error: ' . $e->getMessage());
            return '';
        }
    }

    /**
     * Get user by ID
     */
    public function getUserById(int $userId): ?array
    {
        $user = $this->userModel->findWithRole($userId);
        if ($user) {
            unset($user['password']);
        }
        return $user;
    }

    /**
     * Update user profile
     */
    public function updateProfile(int $userId, array $data): array
    {
        $allowedFields = ['name', 'phone', 'country', 'city', 'bio', 'avatar_url'];
        $updateData = Helpers\filterArray($data, $allowedFields);

        $updateData['updated_at'] = Helpers\getCurrentTimestamp();

        if ($this->userModel->update($userId, $updateData)) {
            $user = $this->userModel->findWithRole($userId);
            unset($user['password']);
            return [
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to update profile',
            'errors' => null
        ];
    }

    /**
     * Change password
     */
    public function changePassword(int $userId, string $oldPassword, string $newPassword): array
    {
        $user = $this->userModel->findWithRole($userId);

        if (!$user || !Helpers\verifyPassword($oldPassword, $user['password'])) {
            return [
                'success' => false,
                'message' => 'Invalid current password',
                'errors' => null
            ];
        }

        if ($this->userModel->update($userId, [
            'password' => Helpers\hashPassword($newPassword),
            'updated_at' => Helpers\getCurrentTimestamp()
        ])) {
            return [
                'success' => true,
                'message' => 'Password changed successfully'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to change password',
            'errors' => null
        ];
    }

    /**
     * Get user IP address
     */
    private function getUserIpAddress(): string
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        } else {
            return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        }
    }

    /**
     * Logout (token invalidation)
     */
    public function logout(string $token): bool
    {
        return $this->jwtManager->blacklistToken($token);
    }

    /**
     * Refresh access token
     */
    public function refreshToken(string $refreshToken): ?array
    {
        try {
            $decoded = $this->jwtManager->decodeToken($refreshToken);
            if (!$decoded || ($decoded['type'] ?? null) !== 'refresh') {
                return null;
            }

            $user = $this->userModel->findWithRole($decoded['sub']);
            if (!$user) {
                return null;
            }

            $newAccessToken = $this->jwtManager->generateAccessToken($user['id'], [
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'] ?? 'user'
            ]);

            return [
                'token' => $newAccessToken,
                'user' => $user
            ];
        } catch (\Exception $e) {
            error_log('Token Refresh Error: ' . $e->getMessage());
            return null;
        }
    }
}
