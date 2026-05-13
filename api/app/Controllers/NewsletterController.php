<?php

namespace Nabta\Controllers;

/**
 * Newsletter Controller
 */
class NewsletterController extends BaseController
{
    /**
     * Subscribe to newsletter
     * POST /api/v1/newsletter/subscribe
     */
    public function subscribe(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $rules = [
            'email' => 'required|email'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        // TODO: Save to database
        $this->success([
            'email' => $this->input('email'),
            'is_subscribed' => true
        ], 'Subscribed successfully', 201);
    }

    /**
     * Unsubscribe from newsletter
     * POST /api/v1/newsletter/unsubscribe
     */
    public function unsubscribe(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->methodNotAllowed();
        }

        $rules = [
            'email' => 'required|email'
        ];

        if (!$this->validate($rules)) {
            $this->error('Validation failed', $this->getErrors(), 422);
        }

        // TODO: Update in database
        $this->success([
            'email' => $this->input('email'),
            'is_subscribed' => false
        ], 'Unsubscribed successfully');
    }
}
