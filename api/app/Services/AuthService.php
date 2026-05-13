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

    public function __construct()
    {
        $this->userModel = new User();
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

        return [
            'success' => true,
            'message' => 'User registered successfully',
            'data' => $user,
            'token' => $this->generateToken($userId)
        ];
    }

    /**
     * Login user
     */
    public function login(string $email, string $password): array
    {
        $user = $this->userModel->findByEmail($email);

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

        return [
            'success' => true,
            'message' => 'Login successful',
            'data' => $user,
            'token' => $this->generateToken($user['id'])
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
        $user = $this->userModel->find($userId);
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
            $user = $this->userModel->find($userId);
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
        $user = $this->userModel->find($userId);

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
}
