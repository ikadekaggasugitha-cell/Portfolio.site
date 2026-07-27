<?php

// Vercel invokes this function at /api/index.php, so Symfony's Request
// auto-detects "/api" as the app's base path and strips it from every
// incoming URL (e.g. /api/v1/health becomes /v1/health), breaking our own
// apiPrefix. Overriding SCRIPT_NAME so basename-matching still succeeds but
// the directory portion no longer collides with our "api/v1" URL prefix.
$_SERVER['SCRIPT_NAME'] = '/index.php';

// TEMPORARY: diagnostic wrapper to surface the real cause of the blank 500 crash.
// Remove once the root cause is identified and fixed.
ini_set('display_errors', '1');
error_reporting(E_ALL);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json');
        }
        echo json_encode([
            'diagnostic' => 'fatal_error',
            'message' => $error['message'],
            'file' => $error['file'],
            'line' => $error['line'],
        ]);
    }
});

try {
    // Forward Vercel requests to Laravel entrypoint
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'diagnostic' => 'uncaught_throwable',
        'exception' => get_class($e),
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString()),
    ]);
}
