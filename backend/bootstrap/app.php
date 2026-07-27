<?php

use App\Exceptions\ApiExceptionHandler;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\JwtMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'jwt.auth' => JwtMiddleware::class,
            'admin' => AdminMiddleware::class,
        ]);

        $middleware->api(prepend: [
            'throttle:api',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // TEMPORARY: surface the primary exception before Laravel's own
        // renderer gets a chance to fail while trying to display it.
        // Remove once the production 500 root cause is fixed.
        $exceptions->report(function (Throwable $e) {
            if (env('APP_DEBUG')) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'diagnostic' => 'primary_exception',
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString()),
                ]);
                exit;
            }
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $handler = new ApiExceptionHandler();
                return $handler->handle($e, $request);
            }
        });
    })->create();
