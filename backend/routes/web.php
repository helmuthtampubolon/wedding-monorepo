<?php

use Illuminate\Support\Facades\Route;

// Semua request SELAIN API akan diarahkan ke index.html milik React
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');
