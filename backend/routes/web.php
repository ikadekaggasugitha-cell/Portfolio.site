<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
    return redirect($frontendUrl);
});

// TEMPORARY: diagnostic route to inspect the live route table. Remove after debugging.
Route::get('/__debug/routes', function () {
    return response()->json(collect(Route::getRoutes())->map(function ($route) {
        return [
            'methods' => $route->methods(),
            'uri' => $route->uri(),
            'action' => $route->getActionName(),
        ];
    })->values());
});
