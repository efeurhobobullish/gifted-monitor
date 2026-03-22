import { PricingCard, ScrollAnimation } from "../ui";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      priceLabel: "",
      description: "Core uptime checks for a small footprint",
      features: [
        "Up to 5 monitors",
        "Intervals: 5, 10, 30, or 60 min (presets only)",
        "Email verification & dashboard",
        "Email alerts (when enabled)",
        "Community & docs",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Elite",
      price: "Contact",
      priceLabel: "",
      description: "Up to 20 sites with standard preset schedules",
      popular: true,
      features: [
        "Up to 20 monitors",
        "Intervals: 3, 5, 10, 30, or 60 min (presets only)",
        "WhatsApp, Telegram & email alerts",
        "Uptime history & dashboards",
        "Priority response",
      ],
      buttonText: "Start monitoring",
    },
    {
      name: "Pro",
      price: "Custom",
      priceLabel: "",
      description: "1-minute checks and higher capacity",
      features: [
        "Up to 100 monitors",
        "Intervals: 1, 3, 5, 10, 30, or 60 min (presets only)",
        "All Elite alert channels",
        "Custom limits & onboarding",
        "Dedicated support & SLAs",
      ],
      buttonText: "Contact sales",
    },
  ];

  return (
    <section id="pricing" className="py-20 relative main">
      {/* Header */}
      <ScrollAnimation from="up" className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          Starter, Elite & Pro
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          Check intervals are preset buttons only (no custom minutes). Elite covers
          up to 20 sites with 3-minute–1-hour schedules; Pro adds 1-minute checks.
        </p>
      </ScrollAnimation>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            delay={Math.min(index * 0.04, 0.12)}
            fromIndex={index}
          />
        ))}
      </div>
    </section>
  );
}
