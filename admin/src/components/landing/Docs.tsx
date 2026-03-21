import { motion } from "framer-motion";
import {
  Server,
  Coins,
  ShieldCheck,
  Activity,
  BookOpen,
} from "lucide-react";

const docs = [
  {
    icon: Server,
    title: "Platform Overview",
    description:
      "EmpireHost is a managed runtime platform for hosting WhatsApp bot instances. It removes the need to manage servers, processes, or uptime manually.",
  },
  {
    icon: Coins,
    title: "Usage & Coins",
    description:
      "The platform operates on a coin-based system. Coins are deducted based on runtime usage, ensuring transparent and predictable costs.",
  },
  {
    icon: Activity,
    title: "Runtime Monitoring",
    description:
      "Each deployment includes live status monitoring, logs, and automatic restarts to ensure reliability.",
  },
  {
    icon: ShieldCheck,
    title: "Security Model",
    description:
      "All bot instances are isolated. Sessions, execution, and data are sandboxed to prevent cross-impact.",
  },
  {
    icon: BookOpen,
    title: "Getting Started",
    description:
      "Fund your wallet, deploy a bot instance, and manage everything from the dashboard without additional configuration.",
  },
];

export default function Docs() {
  return (
    <section
      id="docs"
      className="py-20 px-4 relative bg-gradient-to-b from-background to-secondary/50 backdrop-blur"
    >
      <div className="main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-4 text-primary-2">
            Documentation
          </h2>
          <p className="text-muted text-sm">
            Everything you need to understand how EmpireHost works and how to
            deploy automation reliably.
          </p>
        </motion.div>

        {/* Docs List (new layout, not cards grid) */}
        <div className="space-y-6 max-w-3xl">
          {docs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex gap-4 items-start border border-line rounded-xl p-6 bg-background"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-main">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}