import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  Users,
  Server,
  Activity,
  Clock,
} from "lucide-react";
import { ScrollAnimation } from "../ui";

const features = [
  {
    name: "Bot Instances",
    description:
      "Deploy isolated WhatsApp bot instances with dedicated runtime and session handling.",
    icon: Bot,
  },
  {
    name: "Automation Logic",
    description:
      "Run AI replies, commands, and workflows without managing servers.",
    icon: Cpu,
  },
  {
    name: "User & Group Control",
    description:
      "Manage group behavior, permissions, and automated moderation rules.",
    icon: Users,
  },
  {
    name: "Runtime Infrastructure",
    description:
      "Your bots run on managed infrastructure with monitoring and isolation.",
    icon: Server,
  },
  {
    name: "Live Status & Logs",
    description:
      "Track uptime, errors, and activity in real time from your dashboard.",
    icon: Activity,
  },
  {
    name: "Scheduled Tasks",
    description:
      "Execute timed jobs, broadcasts, and recurring automation reliably.",
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
            Deploy and manage bot runtimes
          </h2>
          <p className="text-muted text-sm">
            EmpireHost handles infrastructure, execution, and uptime —
            you focus on automation logic and results.
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
          <button className="btn btn-primary px-10 h-12 rounded-full">
            Deploy
          </button>
        </ScrollAnimation>
      </div>
    </section>
  );
}