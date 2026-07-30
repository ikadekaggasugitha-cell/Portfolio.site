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

        /**
         * Never redirect unauthenticated requests — this app is a JSON API with no `login`
         * route.
         *
         * Laravel installs `redirectGuestsTo(fn () => route('login'))` by default
         * (Foundation\Configuration\ApplicationBuilder::withMiddleware). For a request
         * without an `Accept: application/json` header, the auth middleware evaluates that
         * callback while *constructing* the AuthenticationException, so `route('login')`
         * threw RouteNotFoundException before any handler ran — and the client got an
         * opaque HTML 500 instead of 401. Returning null keeps the real
         * AuthenticationException intact so ApiExceptionHandler can map it to 401.
         */
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $handler = new ApiExceptionHandler();
                return $handler->handle($e, $request);
            }
        });
    })->create();
