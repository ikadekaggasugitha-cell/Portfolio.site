<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class ApiExceptionHandler
{
    public function handle(Throwable $e, Request $request): ?JsonResponse
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
            $payload = [
                'success' => false,
                'message' => 'Resource not found',
            ];

            // TEMPORARY: surface request-path diagnostics while debugging
            // routes that exist in Route::getRoutes() but don't match. Remove after.
            if (config('app.debug')) {
                $payload['diagnostic'] = [
                    'path' => $request->path(),
                    'decodedPath' => $request->decodedPath(),
                    'pathInfo' => $request->getPathInfo(),
                    'requestUri' => $request->getRequestUri(),
                    'serverRequestUri' => $request->server('REQUEST_URI'),
                    'serverPathInfo' => $request->server('PATH_INFO'),
                    'method' => $request->method(),
                    'scriptName' => $request->server('SCRIPT_NAME'),
                ];
            }

            return response()->json($payload, 404);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        if ($e instanceof AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden',
            ], 403);
        }

        if ($e instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'HTTP Error',
            ], $e->getStatusCode());
        }

        if (config('app.debug')) {
            return null;
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error',
        ], 500);
    }
}
