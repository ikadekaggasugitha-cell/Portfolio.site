<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CertificateController;
use App\Http\Controllers\Api\V1\EducationController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ProjectImageController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('health', function () {
    return response()->json([
        'status' => 'UP',
        'database' => 'UP',
        'cache' => 'UP',
        'storage' => 'UP',
        'version' => '1.0.0',
    ]);
});

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Portfolio IT API',
        'version' => 'v1',
    ]);
});

Route::post('auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');

Route::middleware(['auth:api', 'jwt.auth'])->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);
});

Route::get('projects', [ProjectController::class, 'index']);
Route::get('projects/{id}', [ProjectController::class, 'show']);
Route::get('skills', [SkillController::class, 'index']);
Route::get('experiences', [ExperienceController::class, 'index']);
Route::get('educations', [EducationController::class, 'index']);
Route::get('certificates', [CertificateController::class, 'index']);
Route::get('profile', [ProfileController::class, 'index']);

// Public pages (published)
Route::get('pages/slug/{slug}', [PageController::class, 'publicShow']);

Route::post('messages', [MessageController::class, 'store'])
    ->middleware('throttle:contact');

Route::middleware(['auth:api', 'jwt.auth', 'admin'])->group(function () {
    Route::put('profile/{id}', [ProfileController::class, 'update']);

    Route::apiResource('skills', SkillController::class)->except(['index']);
    Route::apiResource('experiences', ExperienceController::class)->except(['index']);
    Route::apiResource('educations', EducationController::class)->except(['index']);
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::post('projects/{projectId}/images', [ProjectImageController::class, 'store']);
    Route::get('projects/{projectId}/images', [ProjectImageController::class, 'index']);
    Route::post('projects/{projectId}/images/reorder', [ProjectImageController::class, 'reorder']);
    Route::post('projects/{projectId}/images/attach', [ProjectImageController::class, 'attach']);
    
    // Pages
    Route::get('pages', [PageController::class, 'index']);
    Route::get('pages/{id}', [PageController::class, 'show']);
    Route::post('pages', [PageController::class, 'store']);
    Route::put('pages/{id}', [PageController::class, 'update']);
    Route::delete('pages/{id}', [PageController::class, 'destroy']);
    Route::post('pages/{id}/publish', [PageController::class, 'publish']);
    Route::delete('projects/images/{id}', [ProjectImageController::class, 'destroy']);

    // Media library
    Route::get('media', [MediaController::class, 'index']);
    Route::post('media', [MediaController::class, 'store']);
    Route::patch('media/{id}', [MediaController::class, 'update']);
    Route::delete('media/{id}', [MediaController::class, 'destroy']);
    Route::apiResource('certificates', CertificateController::class)->except(['index']);
    Route::apiResource('messages', MessageController::class)->only(['index', 'show', 'destroy']);
});
