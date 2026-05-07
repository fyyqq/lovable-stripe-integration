<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use Stripe\Checkout\Session;
use Stripe\Webhook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentMethod;

class StripeController extends Controller
{
    public function __construct() {
        // Stripe::setApiKey(config('services.stripe.secret'));
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    // 🔹 FLOW 1 — Pay in App (PaymentElement)
    public function createPaymentIntent(Request $request) {
        $planAmount = [ 'Starter' => 1900, 'Pro' => 4900, 'Enterprise' => 14900 ];
        $selectedPlan = $request->plan; // e.g. Pro
        $amount = $planAmount[$selectedPlan];

        $intent = PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        $table_payment = DB::table('payments');
        $table_payment->insert([
            'user_id' => $request->user['id'],
            'stripe_id' => $intent->id,
            'type' => $intent->object,
            'amount' => $amount,
            'currency' => $intent->currency,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        return response()->json([
            'amount' => $amount,
            'client_secret' => $intent->client_secret,
            'stripe_id' => $intent->id,
        ]);
    }

    // 🔹 FLOW 2 — Redirect to Stripe Checkout
    public function createCheckoutSession(Request $request)
    {
        $planAmount = [ 'starter' => 1900, 'pro' => 4900, 'enterprise' => 14900 ];
        $selectedPlan = $request->plan; // e.g. Pro
        $amount = $planAmount[$selectedPlan];

        $session = Session::create([
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => ucfirst($request->plan) . ' Plan',
                ],
                'unit_amount' => $amount,
                ],
            'quantity' => 1,
            ]],
            'success_url' => 'http://localhost:8080/payment-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:8080/payment-failed',
        ]);

        DB::table('payments')->insert([
            'user_id' => $request->user['id'],
            'stripe_id' => $session->id,
            'type' => 'checkout_session',
            'amount' => $amount,
            'currency' => 'usd',
            'status' => 'pending',
            'created_at' => now(),
        ]);

        return response()->json([
            'checkout_url' => $session->url,
            // 'result' => $amount,
        ]);
    }

    // 🔹 WEBHOOK (CHECKOUT SESSION)
    public function webhook(Request $request) {
        $event = Webhook::constructEvent(
            $request->getContent(),
            $request->header('Stripe-Signature'),
            env('STRIPE_WEBHOOK_SECRET')
        );

        Log::info('Webhook hit', [$event->type]);

        if ($event->type === 'payment_intent.succeeded') {
            $id = $event->data->object->id;
            DB::table('payments')->where('stripe_id', $id)->update(['status' => 'succeeded', 'updated_at' => now()]);
        }

        if ($event->type === 'checkout.session.completed') {
            $id = $event->data->object->id;
            DB::table('payments')->where('stripe_id', $id)->update(['status' => 'succeeded', 'updated_at' => now()]);
        }

        if (
            $event->type === 'payment_intent.payment_failed' ||
            $event->type === 'checkout.session.expired'
        ) {
            $id = $event->data->object->id;
            DB::table('payments')->where('stripe_id', $id)->update(['status' => 'failed', 'updated_at' => now()]);
        }

        return response()->json(['ok' => true]);
    }

    // 🔹 FRONTEND POLLING
    public function status($stripeId) {
        $check_payment = DB::table('payments')->where('stripe_id', $stripeId)->firstOrFail();

        return response()->json([
            'payment' => $check_payment
        ]);
    }

    public function updateFailedStatus($stripeId, $reason) {
        $update_payment_status = DB::table('payments')->where('stripe_id', $stripeId)->update(['status' => 'failed', 'reason' => $reason, 'updated_at' => now()]);
        return response()->json(['status' => $update_payment_status]);
    }

    public function recentTransactions() {
        $transactions = DB::table('users')->leftJoin('payments', 'users.id', '=', 'payments.user_id')->get();
        // $transactions = DB::table('payments')->join('users', 'users.id', '=', 'payments.user_id')->latest()->get();
        return response()->json(['transactions' => $transactions]);
    }
}
