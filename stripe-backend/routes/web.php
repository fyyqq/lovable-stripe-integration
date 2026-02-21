<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\StripeController;

Route::get('/', function () {
    return view('welcome');
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