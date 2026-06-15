<?php

use App\Http\Controllers\Admin\GuestController;
use App\Http\Controllers\Admin\InvitationController as AdminInvitationController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicInvitationController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('auth/login', [AuthController::class, 'login']);

Route::get('invitations/{slug}', [PublicInvitationController::class, 'show']);
Route::post('invitations/{slug}/rsvp', [PublicInvitationController::class, 'rsvp']);
Route::post('invitations/{slug}/wishes', [PublicInvitationController::class, 'wish']);
Route::get('invitations/{slug}/wishes', [PublicInvitationController::class, 'wishes']);

// Auth
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::apiResource('invitations', AdminInvitationController::class);

        Route::get('invitations/{invitation}/guests/export', [GuestController::class, 'exportCsv']);
        Route::get('invitations/{invitation}/guests', [GuestController::class, 'index']);
        Route::post('invitations/{invitation}/guests', [GuestController::class, 'store']);
        Route::put('invitations/{invitation}/guests/{guest}', [GuestController::class, 'update']);
        Route::patch('invitations/{invitation}/guests/{guest}/sent', [GuestController::class, 'markSent']);
        Route::delete('invitations/{invitation}/guests/{guest}', [GuestController::class, 'destroy']);
        Route::get('invitations/{invitation}/rsvps', [GuestController::class, 'rsvps']);
        Route::get('invitations/{invitation}/wishes', [GuestController::class, 'wishes']);

        Route::apiResource('templates', TemplateController::class)->except(['show']);
    });
});
