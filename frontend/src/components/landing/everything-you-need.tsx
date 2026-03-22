import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  LayoutDashboard,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ScrollAnimation } from "../ui";

const FEATURES: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Real-time Monitoring",
    description:
      "You pick from preset check intervals (no arbitrary custom minutes). Elite includes 3 min through 1 hr; Pro adds 1-minute checks.",
    icon: RefreshCw,
  },
  {
    title: "Instant WhatsApp Alerts",
    description:
      "The moment a site goes down — or comes back up — you get a WhatsApp message. Not an email. A message.",
    icon: MessageCircle,
  },
  {
    title: "Uptime History",
    description:
      "Visual history bars for the last 30 checks. See uptime percentage and spot patterns at a glance.",
    icon: BarChart3,
  },
  {
    title: "Response Time Tracking",
    description:
      "Track how fast your server responds. Slow sites lose users — catch performance regressions early.",
    icon: Zap,
  },
  {
    title: "Admin Dashboard",
    description:
      "Full admin panel to manage users, monitors, and notification preferences for your whole team.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure by Default",
    description:
      "JWT authentication, bcrypt-hashed passwords, OTP email verification, and rate-limited APIs.",
    icon: ShieldCheck,
  },
];

export default function EverythingYouNeed() {
  return (
    <section id="everything-you-need" className="relative py-28">
      {/* Diagonal grid — subtle; uses token-friendly white alpha */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0px, rgba(148, 163, 184, 0.12) 1px, transparent 1px, transparent 12px)",
        }}
      />

      <div className="main relative z-10">
        <ScrollAnimation className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <span className="inline-flex items-center rounded-full bg-primary/12 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary shadow-[0_0_28px_-6px_rgba(34,197,94,0.45)]">
            Everything You Need
          </span>

          <h2 className="mt-8 font-space text-3xl font-bold leading-tight text-primary-2 md:text-4xl lg:text-5xl">
            Built for reliability,
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
              designed for speed
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted md:text-[15px]">
            Everything your team needs to stay ahead of downtime — in one clean,
            fast dashboard.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <ScrollAnimation key={index}>
                <div
                  className="relative min-h-[200px] overflow-hidden rounded-2xl border border-line bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:glow-green"
                >
                  {/* Depth — works in light + dark */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-main/[0.06] dark:to-black/30" />

                  <div className="relative z-10 max-w-[75%]">
                    <h3 className="text-lg font-semibold text-primary-2">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute -bottom-10 -right-10 flex h-36 w-36 items-center justify-center rounded-full bg-primary/10">
                    <div className="center h-16 w-16 rounded-full bg-primary/20 text-primary">
                      <Icon size={28} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
