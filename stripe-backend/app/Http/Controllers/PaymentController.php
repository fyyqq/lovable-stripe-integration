<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use Illuminate\Http\Request;

// This controller will handle payment-related actions such as creating payment intents and checking payment status.

class PaymentController extends Controller
{
    public function create()
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount' => 1000,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        Payment::create([
            'stripe_payment_intent_id' => $intent->id,
            'amount' => 1000,
            'currency' => 'usd',
            'status' => 'pending',
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'intent_id' => $intent->id,
        ]);
    }

    public function status($intentId)
    {
        $payment = Payment::where('stripe_payment_intent_id', $intentId)->firstOrFail();
        return response()->json($payment);
    }
}