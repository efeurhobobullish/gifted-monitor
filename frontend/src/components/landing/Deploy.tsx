import { motion } from "framer-motion";
import {
  Globe,
  Activity,
  Bell,
  ShieldCheck,
  LineChart,
  Clock,
} from "lucide-react";
import { ScrollAnimation } from "../ui";

const features = [
  {
    name: "HTTP & HTTPS checks",
    description:
      "Configure GET, HEAD, or POST requests with intervals that fit your SLA.",
    icon: Globe,
  },
  {
    name: "Status & uptime",
    description:
      "See which monitors are up, flapping, or down with history where the API exposes it.",
    icon: Activity,
  },
  {
    name: "Multi-channel alerts",
    description:
      "Route downtime and recovery alerts through WhatsApp, Telegram, and email.",
    icon: Bell,
  },
  {
    name: "Secure accounts",
    description:
      "JWT sessions, hashed passwords, and email OTP for verification.",
    icon: ShieldCheck,
  },
  {
    name: "Dashboard insight",
    description:
      "Track monitors and recent checks from a single control surface.",
    icon: LineChart,
  },
  {
    name: "Retries & recovery",
    description:
      "Built-in check logic helps reduce false positives before declaring an outage.",
    icon: Clock,
  },
];

export default function Deploy() {
  return (
    <section className="py-24">
      <div className="main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
            Monitoring built for clarity
          </h2>
          <p className="text-muted text-sm">
            Gifted Monitor runs checks from the cloud — you define what to watch
            and how you want to be notified.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="border border-line rounded-xl p-6 bg-background"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <ScrollAnimation
          once={true}
          duration={0.6}
          className="flex justify-center mt-20"
        >
          <button type="button" className="btn btn-primary px-10 h-12 rounded-full">
            Get started
          </button>
        </ScrollAnimation>
      </div>
    </section>
  );
}
