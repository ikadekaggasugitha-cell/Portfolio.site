<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Restricted from '*'. Browser traffic reaches this API same-origin through the
    // frontend's Next.js rewrite, so a tight allow-list does not affect the app while
    // blocking arbitrary third-party origins. Extra origins can be added via the
    // comma-separated CORS_ALLOWED_ORIGINS env var.
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'https://kadekagga-portfolio.vercel.app,http://localhost:3000'))
    ))),

    'allowed_origins_patterns' => [
        // Custom domain (apex + any subdomain)
        '#^https://([a-z0-9-]+\.)?kadekagga\.app$#',
        // This project's Vercel production + preview deployments
        '#^https://(kadekagga-portfolio|site-portfolio[a-z0-9-]*)\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => false,

];
