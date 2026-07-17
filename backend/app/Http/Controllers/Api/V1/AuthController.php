<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $result = $this->authService->login($request->only('email', 'password'));

        if (!$result) {
            return $this->unauthorized('Invalid credentials');
        }

        return $this->success([
            'token' => $result['token'],
            'token_type' => 'bearer',
            'expires_in' => $result['expires_in'],
            'user' => new UserResource($result['user']),
        ], 'Login success');
    }

    public function me(): JsonResponse
    {
        return $this->success(
            new UserResource(auth()->user()),
            'Profile retrieved'
        );
    }

    public function logout(): JsonResponse
    {
        auth()->logout();
        return $this->success(null, 'Successfully logged out');
    }

    public function refresh(): JsonResponse
    {
        $token = auth()->refresh();
        return $this->success([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ], 'Token refreshed');
    }
}
