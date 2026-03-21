import { PricingCard, ScrollAnimation } from "../ui";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      priceLabel: "",
      description: "Get started with core monitoring",
      features: [
        "Add monitors for your key URLs",
        "Email verification at signup",
        "Configurable check intervals",
        "Community & docs",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Team",
      price: "Pro",
      priceLabel: "",
      description: "More monitors and priority support",
      popular: true,
      features: [
        "Higher monitor limits",
        "WhatsApp, Telegram & email alerts",
        "Uptime history & dashboards",
        "Priority response",
      ],
      buttonText: "Start monitoring",
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceLabel: "",
      description: "For orgs with SLAs and compliance needs",
      features: [
        "Custom limits & onboarding",
        "Dedicated support channel",
        "Security review assistance",
        "Volume & contract pricing",
      ],
      buttonText: "Contact sales",
    },
  ];

  return (
    <section id="pricing" className="py-20 relative main">
      {/* Header */}
      <ScrollAnimation className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          Simple monitoring plans
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          Gifted Monitor scales with you — start free and upgrade when you need
          more monitors, channels, or support.
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
