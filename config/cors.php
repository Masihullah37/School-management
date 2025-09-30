<?php

// All specific origins used for testing and production
$allowed_origins = [
    // --- Local Development URLs ---
    'http://localhost:3000',
    'http://127.0.0.1:3000',

    // --- Production/Staging URLs ---
    'http://test.icvinformatique.com',
    'https://test.icvinformatique.com',
    'http://laravel.test.icvinformatique.com',
    'https://laravel.test.icvinformatique.com',
    // Note: We only need the base URLs (no trailing slash like '/').
];

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | CORS is a security feature built into web browsers. This file tells the
    | browser which other websites (origins) are allowed to talk to your API.
    |
    */

    // 1. WHICH URLS ARE ALLOWED TO ACCESS YOUR API?
    // We combine the URL from your .env file (FRONTEND_URL) with the list above.
    'allowed_origins' => array_unique(array_merge(
        [$_ENV['FRONTEND_URL'] ?? 'http://localhost:3000'],
        $allowed_origins
    )),

    // 2. WHICH ROUTES ARE PROTECTED?
    // The '*' means "apply these rules to ALL API routes (e.g., /api/*)".
    'paths' => ['*'],

    // 3. WHICH HTTP COMMANDS ARE ALLOWED?
    // The '*' means "allow all methods" (GET, POST, PUT, DELETE, etc.).
    'allowed_methods' => ['*'],

    // 4. WHICH HEADERS ARE ALLOWED TO BE SENT?
    // The '*' means "allow all common headers" (like Authorization, Content-Type, etc.).
    'allowed_headers' => ['*'],

    // 5. ALLOW COOKIES/AUTHENTICATION?
    // Setting this to true allows credentials (like cookies and authorization tokens) to be sent.
    'supports_credentials' => true,

    // --- Advanced Settings (Usually kept at default) ---
    'allowed_origins_patterns' => [],
    'exposed_headers' => [],
    'max_age' => 0,
];