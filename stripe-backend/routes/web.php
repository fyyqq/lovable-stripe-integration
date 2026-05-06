<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\StripeController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('app');
});

Route::post('/api/signin', [AuthController::class, 'signin'])->name('signin');
Route::post('/api/signup', [AuthController::class, 'signup'])->name('signup');
Route::post('/api/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/api/user', [AuthController::class, 'getUser'])->middleware('auth')->name('get_user');
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::post('/create-payment-intent', [PaymentController::class, 'create']);
// Route::get('/payments/{intentId}', [PaymentController::class, 'status']);
// Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);

Route::post('/api/create-payment-intent', [StripeController::class, 'createPaymentIntent']); // Pay in App
Route::post('/api/create-checkout-session', [StripeController::class, 'createCheckoutSession']); // Redirect to Stripe Checkout
Route::post('/api/stripe/webhook', [StripeController::class, 'webhook']);
Route::get('/api/find-payments/{stripeId}', [StripeController::class, 'status']);
Route::post('/api/update-status-payments/{stripeId}/{reason}', [StripeController::class, 'updateFailedStatus']);
Route::get('/api/recent-transactions', [StripeController::class, 'recentTransactions']);

Route::get('/stripe/config', function() {
    return response()->json(['publishableKey' => config('services.stripe.public')]);
});
