<?php

namespace Nabta\Controllers;

use Nabta\Services\AuthService;

/**
 * Authentication Controller
 */
class AuthController extends BaseController
{
    private AuthService $authService;

    public function __construct()
    {
        parent::__construct();
        $this->authService = new AuthService();
    }

    /**
     * Register endpoint
     * POST /api/v1/auth/register
     */
    public function register(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $rules = [
            'name' => 'required|min:3|max:100',
            'email' => 'required|email',
            'password' => 'required|min:8|max:255'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        $result = $this->authService->register([
            'name' => $this->input('name'),
            'email' => $this->input('email'),
            'password' => $this->input('password')
        ]);

        if ($result['success']) {
            $this->success($result['data'], $result['message'], 201);
        } else {
            $this->error($result['message'], $result['errors'] ?? null, 400);
        }
    }

    /**
     * Login endpoint
     * POST /api/v1/auth/login
     */
    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $rules = [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        $result = $this->authService->login(
            $this->input('email'),
            $this->input('password')
        );

        if ($result['success']) {
            $this->success([
                'user' => $result['data'],
                'accessToken' => $result['token'],
                'refreshToken' => $result['refreshToken']
            ], $result['message']);
        } else {
            $this->error($result['message'], null, 401);
        }
    }

    /**
     * Get current user
     * GET /api/v1/auth/me
     */
    public function me(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();

        if (!$userId) {
            $this->unauthorized();
        }

        $user = $this->authService->getUserById($userId);

        if (!$user) {
            $this->notFound();
        }

        $this->success($user, 'User data retrieved successfully');
    }

    /**
     * Update profile
     * PUT /api/v1/auth/profile
     */
    public function updateProfile(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();

        if (!$userId) {
            $this->unauthorized();
        }

        $result = $this->authService->updateProfile($userId, $this->request);

        if ($result['success']) {
            $this->success($result['data'], $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Change password
     * POST /api/v1/auth/change-password
     */
    public function changePassword(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();

        if (!$userId) {
            $this->unauthorized();
        }

        $rules = [
            'old_password' => 'required',
            'new_password' => 'required|min:8'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        $result = $this->authService->changePassword(
            $userId,
            $this->input('old_password'),
            $this->input('new_password')
        );

        if ($result['success']) {
            $this->success(null, $result['message']);
        } else {
            $this->error($result['message'], null, 400);
        }
    }

    /**
     * Google login (stub)
     * POST /api/v1/auth/google
     */
    public function googleLogin(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        // Implement Google OAuth flow
        $this->error('Google login not yet implemented', null, 501);
    }

    /**
     * Logout (token invalidation)
     * POST /api/v1/auth/logout
     */
    public function logout(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $token = $this->getTokenFromHeaders();
        
        if ($token && $this->authService->logout($token)) {
            $this->success(null, 'Logged out successfully');
        } else {
            $this->error('Logout failed', null, 400);
        }
    }

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     */
    public function refresh(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $refreshToken = $this->input('refreshToken');
        
        if (!$refreshToken) {
            $this->error('Refresh token is required', null, 422);
        }

        $result = $this->authService->refreshToken($refreshToken);
        
        if ($result) {
            $this->success([
                'user' => $result['user'],
                'accessToken' => $result['token']
            ], 'Token refreshed successfully');
        } else {
            $this->error('Invalid or expired refresh token', null, 401);
        }
    }
}
