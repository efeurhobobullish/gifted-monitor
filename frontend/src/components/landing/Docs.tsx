import { motion } from "framer-motion";
import {
  Server,
  Mail,
  ShieldCheck,
  Activity,
  BookOpen,
} from "lucide-react";

const docs = [
  {
    icon: Server,
    title: "Platform overview",
    description:
      "Gifted Monitor is a managed uptime service. You add URLs, set intervals, and receive alerts when availability changes — without running your own probe infrastructure.",
  },
  {
    icon: Mail,
    title: "Signup & alerts",
    description:
      "Email OTP secures new accounts. Monitor alerts are optional per channel: WhatsApp, Telegram, and HTML email — separate from verification email.",
  },
  {
    icon: Activity,
    title: "Checks & history",
    description:
      "The backend records check results so dashboards can show current status, trends, and recovery events.",
  },
  {
    icon: ShieldCheck,
    title: "Security model",
    description:
      "Use strong passwords, protect JWT storage on clients, and restrict API access in production with CORS and HTTPS.",
  },
  {
    icon: BookOpen,
    title: "Getting started",
    description:
      "Verify your email, create monitors for production URLs, and enable at least one alert channel so you never miss an incident.",
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
            Everything you need to understand how Gifted Monitor works and how
            to roll out monitoring responsibly.
          </p>
        </motion.div>

        {/* Docs List (new layout, not cards grid) */}
        <div className="space-y-6 max-w-3xl">
          {docs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-xl border border-line bg-background"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-main mb-2">{item.title}</h3>
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
