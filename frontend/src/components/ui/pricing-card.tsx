import { Check } from "lucide-react";
import ScrollAnimation, { scrollRevealFromIndex } from "./scroll-animation";

interface PricingCardProps {
  name: string;
  price: string;
  priceLabel?: string;
  description: string;
  features: string[];
  note?: string;
  popular?: boolean;
  delay?: number;
  buttonText?: string;
}

export default function PricingCard({
  plan,
  delay,
  fromIndex = 0,
}: {
  plan: PricingCardProps;
  delay: number;
  fromIndex?: number;
}) {
  const {
    name,
    price,
    priceLabel,
    description,
    features,
    note,
    popular,
    buttonText,
  } = plan;

  const cardClass = `relative rounded-2xl p-8 bg-background border ${
    popular ? "border-primary" : "border-line"
  } transition-colors`;

  return (
    <ScrollAnimation
      from={scrollRevealFromIndex(fromIndex)}
      delay={delay}
      amount={0.15}
      margin="-40px"
      className={cardClass}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-main mb-1">{name}</h3>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-primary">{price}</span>
            {priceLabel && (
              <span className="text-sm text-muted">{priceLabel}</span>
            )}
          </div>

          <p className="mt-3 text-sm text-muted">{description}</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                size={18}
                className="text-primary flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-main/80">{feature}</span>
            </li>
          ))}
        </ul>

        {note && (
          <p className="text-xs text-muted italic pt-3 border-t border-line">
            {note}
          </p>
        )}

        <a
          href="#"
          className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors active:scale-[0.99] hover:opacity-95 ${
            popular
              ? "btn-primary"
              : "border border-line hover:border-primary"
          }`}
        >
          {buttonText ?? "Get Started"}
        </a>
      </div>
    </ScrollAnimation>
  );
}
