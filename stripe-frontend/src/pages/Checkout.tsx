import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/useAuth";

// load once (use your Vite env key)

async function getStripePublishableKey() {
    const response = await fetch("http://localhost:8000/stripe/config");
    const data = await response.json();
    return data.publishableKey;
}

const stripePromise = loadStripe(await getStripePublishableKey());

const planDetails: Record<string, { name: string; price: string; features: string[] }> = {
    starter: {
        name: "Starter",
        price: "$19/month",
        features: ["1,000 transactions", "Basic analytics", "Email support"],
    },
    pro: {
        name: "Pro",
        price: "$49/month",
        features: ["10,000 transactions", "Advanced analytics", "Priority support"],
    },
    enterprise: {
        name: "Enterprise",
        price: "$149/month",
        features: ["Unlimited transactions", "Real-time analytics", "24/7 support"],
    },
};

function StripePaymentForm({ selectedPlan, stripeID }: { selectedPlan; stripeID }) {
    const stripe = useStripe();
    const elements = useElements();
    const [localLoading, setLocalLoading] = useState(false);
    const [isPaymentFieldComplete, setIsPaymentComplete] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLocalLoading(true);
        
        // 1. You can handle your "other form data" here
        // Example: await saveOrderToDatabase(otherData);
        
        // 2. Then proceed with Stripe
        const { error } = await stripe.confirmPayment({
            elements,
            // clientSecret: ClientRequest
            confirmParams: { return_url: "http://localhost:8080/payment-success" },
            // redirect: "if_required",
        });

        // ... handle error
        if (error) {
            setLocalLoading(false);
            // console.error("Payment confirmation error:", error.message);

            const currentStripeID = document.getElementById("stripe-payment-form").getAttribute("data-stripe-id");
            await fetch(`http://127.0.0.1:8000/api/update-status-payments/${currentStripeID}/${error.message}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
            .then(data => {
                if (data) {
                    // Redirect to failed page
                    window.location.href = `/payment-failed?reason=${error.code}`;
                }
            }).catch(err => console.error("Error updating payment status:", err));
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6" data-stripe-id={stripeID} id="stripe-payment-form">
                <div className="space-y-3">
                    <PaymentElement onChange={ (event) => {
                        setIsPaymentComplete(event.complete);
                    } } />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={localLoading || !isPaymentFieldComplete}>
                    {localLoading ? "Processing..." : `Pay ${selectedPlan.price}`}
                </Button>
            </form>
        </>
    );
}

const Checkout = () => {
    const { auth } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const plan = searchParams.get("plan") || "pro";
    const selectedPlan = planDetails[plan] || planDetails.pro;
    const [stripeID, setStripeID] = useState('')
    const intentCreated = useRef(false);
    
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // Add this guard clause
        if (!auth.user_data || intentCreated.current) return;

        intentCreated.current = true; 

        fetch("http://127.0.0.1:8000/api/create-payment-intent", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan: selectedPlan.name, user: auth.user_data }),
        }).then(res => res.json())
        .then(data => {
            setClientSecret(data.client_secret);
            setStripeID(data.stripe_id);
        })
        .catch(err => console.error(err));
    }, [auth.user_data]); // Also update dependency

    
    return (
        <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
                <p className="text-muted-foreground mb-8">Complete your purchase to get started</p>
                
                <div className="grid lg:grid-cols-5 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent>
                            {/* Stripe PaymentElement Container */}
                            <div className="space-y-3 mt-5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                    <Label>Payment details</Label>
                                </div>
                                <div id="stripe-payment-element" className="min-h-[100%] rounded-lg p-0">
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                        <StripePaymentForm selectedPlan={selectedPlan} stripeID={stripeID} />
                                    </Elements>
                                ) : (
                                    <div className="flex items-center justify-center min-h-[120px]">
                                        <p className="text-sm text-muted-foreground">Loading payment form…</p>
                                    </div>
                                )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground text-center">Your payment is securely processed by Stripe</p>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Lock className="w-3 h-3" />
                                <span>256-bit SSL encrypted</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-4">
                            <h2 className="font-semibold text-foreground">Order Summary</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                            <span className="text-foreground font-medium">{selectedPlan.name} Plan</span>
                            <span className="text-foreground">{selectedPlan.price}</span>
                            </div>
                            
                            <Separator />
                            
                            <ul className="space-y-2">
                                {selectedPlan.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-muted-foreground">
                                    • {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-semibold text-foreground">{selectedPlan.price}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
};

export default Checkout;
