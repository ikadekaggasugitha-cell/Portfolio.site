<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
    return redirect($frontendUrl);
});
