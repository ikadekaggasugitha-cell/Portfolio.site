<?php

use App\Http\Controllers\MediaProxyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
    return redirect($frontendUrl);
});

// Serve uploaded media from R2 through this domain (r2.dev is ISP-blocked in Indonesia).
Route::get('/cdn/{path}', [MediaProxyController::class, 'show'])->where('path', '.*');
