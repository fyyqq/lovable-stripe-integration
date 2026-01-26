<?php

namespace App\Http\Controllers;

use Stripe\Webhook;
use App\Models\Payment;
use Illuminate\Http\Request;

// This controller will handle Stripe webhook events such as payment success or failure.
class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $event = Webhook::constructEvent(
            $request->getContent(),
            $request->header('Stripe-Signature'),
            env('STRIPE_WEBHOOK_SECRET')
        );
    
        if ($event->type === 'payment_intent.succeeded') {
            Payment::where(
                'stripe_payment_intent_id',
                $event->data->object->id
            )->update(['status' => 'succeeded']);
        }
    
        if ($event->type === 'payment_intent.payment_failed') {
            Payment::where(
                'stripe_payment_intent_id',
                $event->data->object->id
            )->update(['status' => 'failed']);
        }
    
        return response()->json(['ok' => true]);
    }
}
