<?php

// Vercel invokes this function at /api/index.php, so Symfony's Request
// auto-detects "/api" as the app's base path and strips it from every
// incoming URL (e.g. /api/v1/health becomes /v1/health), breaking our own
// apiPrefix. Overriding SCRIPT_NAME so basename-matching still succeeds but
// the directory portion no longer collides with our "api/v1" URL prefix.
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Forward Vercel requests to Laravel entrypoint
require __DIR__ . '/../public/index.php';
