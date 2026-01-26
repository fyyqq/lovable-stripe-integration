<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;

Route::get('/', function () {
    return view('welcome');
});


Route::post('/create-payment-intent', [PaymentController::class, 'create']);
Route::get('/payments/{intentId}', [PaymentController::class, 'status']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
