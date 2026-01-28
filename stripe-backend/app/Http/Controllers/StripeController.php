<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use Stripe\Checkout\Session;
use Stripe\Webhook;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class StripeController extends Controller
{
    public function __construct() {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // 🔹 FLOW 1 — Pay in App (PaymentElement)
    public function createPaymentIntent(Request $request) : JsonResponse
    {

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $amount = $request->amount; // e.g. 4900

        $intent = PaymentIntent::create([
            // 'amount' => $amount,
            'amount' => 1200,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        // Payment::create([
        //     'stripe_id' => $intent->id,
        //     'type' => 'payment_intent',
        //     'amount' => $amount,
        //     'currency' => 'usd',
        //     'status' => 'pending',
        // ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'stripe_id' => $intent->id,
        ]);
    }

    // 🔹 FLOW 2 — Redirect to Stripe Checkout
    public function createCheckoutSession(Request $request)
    {
        $amount = $request->amount;

        $session = Session::create([
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'Pro Plan',
                ],
                'unit_amount' => $amount,
                ],
            'quantity' => 1,
            ]],
            'success_url' => 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:5173/cancel',
        ]);

        Payment::create([
            'stripe_id' => $session->id,
            'type' => 'checkout_session',
            'amount' => $amount,
            'currency' => 'usd',
            'status' => 'pending',
        ]);

        return response()->json([
            'checkout_url' => $session->url,
        ]);
    }

    // 🔹 WEBHOOK (SOURCE OF TRUTH)
    public function webhook(Request $request) {
        $event = Webhook::constructEvent(
        $request->getContent(),
        $request->header('Stripe-Signature'),
        env('STRIPE_WEBHOOK_SECRET')
        );

        if ($event->type === 'payment_intent.succeeded') {
            $id = $event->data->object->id;
            Payment::where('stripe_id', $id)->update(['status' => 'succeeded']);
        }

        if ($event->type === 'checkout.session.completed') {
            $id = $event->data->object->id;
            Payment::where('stripe_id', $id)->update(['status' => 'succeeded']);
        }

        if (
            $event->type === 'payment_intent.payment_failed' ||
            $event->type === 'checkout.session.expired'
        ) {
            $id = $event->data->object->id;
            Payment::where('stripe_id', $id)->update(['status' => 'failed']);
        }

        return response()->json(['ok' => true]);
    }

    // 🔹 FRONTEND POLLING
    public function status($stripeId) {
        return Payment::where('stripe_id', $stripeId)->firstOrFail();
    }
}
