<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ComplaintController;
use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\LedgerController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\RazorpayWebhookController;
use App\Http\Controllers\Api\V1\SocietyController;
use App\Http\Controllers\Api\V1\UnitController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\VehicleController;
use App\Http\Controllers\Api\V1\VisitorController;
use App\Http\Controllers\Api\V1\VisitorPassController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => response()->json(['status' => 'ok']));

    Route::post('/webhooks/razorpay', [RazorpayWebhookController::class, 'handle']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware(['role:super_admin'])->group(function () {
            Route::put('/user/current-society', [AuthController::class, 'updateCurrentSociety']);
            Route::patch('/user/current-society', [AuthController::class, 'updateCurrentSociety']);
            Route::get('/societies', [SocietyController::class, 'index']);
            Route::post('/societies', [SocietyController::class, 'store']);
            Route::get('/societies/{society}', [SocietyController::class, 'show']);
            Route::patch('/societies/{society}', [SocietyController::class, 'update']);
            Route::put('/societies/{society}', [SocietyController::class, 'update']);
            Route::delete('/societies/{society}', [SocietyController::class, 'destroy']);
        });

        Route::middleware(['role:guard,society_admin,super_admin,resident'])->group(function () {
            Route::get('/units', [UnitController::class, 'index']);
        });

        Route::middleware(['role:guard,society_admin,super_admin'])->group(function () {
            Route::get('/visitors', [VisitorController::class, 'index']);
            Route::post('/visitors/check-in', [VisitorController::class, 'store']);
            Route::post('/visitors/{visitor}/check-out', [VisitorController::class, 'checkOut']);
            Route::post('/visitor-passes/redeem', [VisitorPassController::class, 'redeem']);
        });

        Route::middleware(['role:society_admin,super_admin,resident'])->group(function () {
            Route::get('/visitor-passes', [VisitorPassController::class, 'index']);
            Route::post('/visitor-passes', [VisitorPassController::class, 'store']);
            Route::post('/visitor-passes/{visitorPass}/revoke', [VisitorPassController::class, 'revoke']);
            Route::get('/vehicles', [VehicleController::class, 'index']);
            Route::post('/vehicles', [VehicleController::class, 'store']);
            Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);
        });

        Route::middleware(['role:society_admin,super_admin,resident'])->group(function () {
            Route::get('/invoices', [InvoiceController::class, 'index']);
            Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);

            Route::get('/payments', [PaymentController::class, 'index']);
            Route::get('/ledger', [LedgerController::class, 'index']);

            Route::get('/complaints', [ComplaintController::class, 'index']);
            Route::post('/complaints', [ComplaintController::class, 'store']);
            Route::get('/complaints/{complaint}', [ComplaintController::class, 'show']);
        });

        Route::middleware(['role:society_admin,super_admin'])->group(function () {
            Route::post('/invoices', [InvoiceController::class, 'store']);
            Route::post('/payments', [PaymentController::class, 'store']);
            Route::patch('/invoices/{invoice}', [InvoiceController::class, 'update']);
            Route::put('/invoices/{invoice}', [InvoiceController::class, 'update']);

            Route::patch('/complaints/{complaint}', [ComplaintController::class, 'update']);
            Route::put('/complaints/{complaint}', [ComplaintController::class, 'update']);

            Route::get('/users/assignable', [UserController::class, 'assignable']);
            Route::get('/users/residents', [UserController::class, 'residents']);

            Route::post('/units', [UnitController::class, 'store']);
            Route::get('/units/{unit}', [UnitController::class, 'show']);
            Route::patch('/units/{unit}', [UnitController::class, 'update']);
            Route::put('/units/{unit}', [UnitController::class, 'update']);
            Route::delete('/units/{unit}', [UnitController::class, 'destroy']);
            Route::post('/units/{unit}/members', [UnitController::class, 'attachMember']);
            Route::delete('/units/{unit}/members/{user}', [UnitController::class, 'detachMember']);
        });
    });
});
