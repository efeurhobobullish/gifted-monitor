import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
}: {
  plan: PricingCardProps;
  delay: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className={`relative rounded-2xl p-8 bg-background border ${
        popular ? "border-primary" : "border-line"
      } transition-colors`}
    >
      {/* Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-main mb-1">
            {name}
          </h3>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-primary">
              {price}
            </span>
            {priceLabel && (
              <span className="text-sm text-muted">
                {priceLabel}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-muted">
            {description}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                size={18}
                className="text-primary flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-main/80">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Note */}
        {note && (
          <p className="text-xs text-muted italic pt-3 border-t border-line">
            {note}
          </p>
        )}

        {/* CTA */}
        <motion.a
          href="#"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`block text-center py-3 rounded-full text-sm font-semibold transition-colors ${
            popular
              ? "btn-primary"
              : "border border-line hover:border-primary"
          }`}
        >
          {buttonText ?? "Get Started"}
        </motion.a>
      </div>
    </motion.div>
  );
}