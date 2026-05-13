<?php

namespace Nabta\Controllers;

/**
 * Contact Controller
 */
class ContactController extends BaseController
{
    /**
     * Submit contact form
     * POST /api/v1/contact
     */
    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $rules = [
            'name' => 'required|min:3',
            'email' => 'required|email',
            'message' => 'required|min:10'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        // TODO: Save to database and send email
        $this->success([
            'id' => 1,
            'name' => $this->input('name'),
            'email' => $this->input('email'),
            'message' => $this->input('message')
        ], 'Message sent successfully', 201);
    }

    /**
     * Get contact messages (Admin)
     * GET /api/v1/contact/messages
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->methodNotAllowed();
        }

        $userId = $this->getAuthUserId();
        if (!$userId) {
            $this->unauthorized();
        }

        // TODO: Fetch from database with admin check
        $this->success([]);
    }
}
