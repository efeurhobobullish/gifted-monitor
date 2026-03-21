import { PricingCard, ScrollAnimation } from "../ui";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "100 Coins",
      priceLabel: "",
      description: "For testing and small deployments",
      features: [
        "Deploy 1 bot instance",
        "Standard runtime environment",
        "Basic logs & status monitoring",
        "Community support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Growth",
      price: "350 Coins",
      priceLabel: "",
      description: "Best for active automation usage",
      popular: true,
      features: [
        "Deploy up to 3 bot instances",
        "Priority runtime allocation",
        "Live logs & usage metrics",
        "Auto-restart on failure",
        "Email & chat support",
      ],
      buttonText: "Start Deploying",
    },
    {
      name: "Scale",
      price: "Custom",
      priceLabel: "",
      description: "For teams and high-volume automation",
      features: [
        "Unlimited bot deployments",
        "Dedicated runtime resources",
        "Advanced monitoring & alerts",
        "Custom limits & policies",
        "Priority onboarding & support",
      ],
      buttonText: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-20 relative main">
      {/* Header */}
      <ScrollAnimation className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          Simple, usage-based pricing
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          EmpireHost uses a transparent coin system. Pay only for the runtime
          resources you use — no hidden fees.
        </p>
      </ScrollAnimation>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
}