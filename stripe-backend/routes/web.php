<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/signin', [AuthController::class, 'signin']);
Route::post('/api/signup', [AuthController::class, 'signup']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::post('/create-payment-intent', [PaymentController::class, 'create']);
// Route::get('/payments/{intentId}', [PaymentController::class, 'status']);
// Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);

Route::post('/api/create-payment-intent', [StripeController::class, 'createPaymentIntent']); // Pay in App
Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']); // Redirect to Stripe Checkout
Route::post('/stripe/webhook', [StripeController::class, 'webhook']);
Route::get('/payments/{stripeId}', [StripeController::class, 'status']);

Route::get('/stripe/config', function() {
    return response()->json(['publishableKey' => config('services.stripe.public')]);
});
