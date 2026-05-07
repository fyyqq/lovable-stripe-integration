import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/pricing/PricingCard";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for individuals and small projects",
    features: [
      "Up to 1,000 transactions",
      "Basic analytics",
      "Email support",
      "API access",
    ],
    priceId: "price_starter",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams and businesses",
    features: [
      "Up to 10,000 transactions",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom webhooks",
      "Team collaboration",
    ],
    popular: true,
    priceId: "price_pro",
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited transactions",
      "Real-time analytics",
      "24/7 dedicated support",
      "Advanced API access",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
    ],
    priceId: "price_enterprise",
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the plan that works best for you. All plans include a 14-day free trial.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              All plans include
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {["SSL Security", "99.9% Uptime", "GDPR Compliant", "24/7 Monitoring"].map((feature) => (
                <div key={feature} className="text-sm text-muted-foreground">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
