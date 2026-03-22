import {
  BarChart3,
  BellRing,
  Check,
  Globe,
  MessageCircle,
  Zap,
} from "lucide-react";

/** Desktop left column — login (single brand title, Lucide icons) */
export function AuthLoginAside() {
  const items = [
    {
      icon: BellRing,
      title: "Instant WhatsApp Alerts",
      description: "Get notified the second your site goes down",
    },
    {
      icon: BarChart3,
      title: "Uptime Analytics",
      description: "Track response times and full uptime history",
    },
    {
      icon: Zap,
      title: "Checks Every 3 Minutes",
      description: "Round-the-clock monitoring, 24 hours a day",
    },
    {
      icon: Globe,
      title: "HTTP & HTTPS Monitoring",
      description: "GET, POST and custom request body support",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-center pr-0 lg:pr-10 xl:pr-14">
      <div className="mb-10">
        <h1 className="font-space text-3xl font-bold tracking-tight text-main sm:text-4xl">
          Gifted Monitor
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          Know the moment your site goes down — before your users do.
        </p>
      </div>

      <ul className="max-w-md space-y-5">
        {items.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-secondary text-primary"
              aria-hidden
            >
              <Icon size={22} strokeWidth={2} />
            </span>
            <div>
              <p className="font-semibold text-main">{title}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-t border-line pt-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
          Trusted by site owners worldwide
        </p>
        <div className="flex items-center gap-2">
          {["A", "B", "C"].map((letter) => (
            <span
              key={letter}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-bold text-primary-2"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIGNUP_BULLETS = [
  "Monitor unlimited sites",
  "WhatsApp alerts within seconds",
  "Response time tracking",
  "Uptime percentage history",
  "Checks every 3 minutes, 24/7",
  "Admin dashboard for teams",
];

/** Desktop left column — signup */
export function AuthSignupAside() {
  return (
    <div className="flex h-full flex-col justify-center pr-0 lg:pr-10 xl:pr-14">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold tracking-tight text-primary-2 sm:text-4xl">
          Start monitoring for free
        </h1>
        <p className="mt-3 text-sm text-muted">
          No credit card required — unless you want to upgrade.
        </p>
      </div>

      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-secondary/80 p-4 dark:bg-secondary/40">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <MessageCircle size={22} strokeWidth={2} />
        </span>
        <div>
          <p className="font-semibold text-main">Get alerts on WhatsApp instantly</p>
          <p className="mt-1 text-sm text-muted">
            Link your number after signup and receive down/up alerts in seconds.
          </p>
        </div>
      </div>

      <ul className="max-w-md space-y-3">
        {SIGNUP_BULLETS.map((line) => (
          <li key={line} className="flex items-start gap-3 text-sm text-main">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <blockquote className="mt-10 border-l-2 border-primary/50 pl-5">
        <p className="text-sm italic leading-relaxed text-muted">
          &ldquo;Gifted Monitor caught our site going down before any of our users
          noticed. The WhatsApp alert came through in under a minute.&rdquo;
        </p>
        <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-2">
          — Site owner
        </footer>
      </blockquote>
    </div>
  );
}

export function AuthMobileBrand({ mode }: { mode: "login" | "signup" }) {
  if (mode === "signup") {
    return (
      <div className="mb-8 text-center lg:hidden">
        <img
          src="/logo.svg"
          alt=""
          className="mx-auto mb-3 h-10 w-10 rounded-xl opacity-95"
          width={40}
          height={40}
        />
        <h1 className="font-space text-xl font-bold text-primary-2">
          Start monitoring for free
        </h1>
        <p className="mt-2 text-sm text-muted">
          No credit card required — verify your email to get started.
        </p>
      </div>
    );
  }
  return (
    <div className="mb-8 text-center lg:hidden">
      <h1 className="font-space text-xl font-bold text-main">Gifted Monitor</h1>
      <p className="mt-2 mx-auto max-w-sm text-sm text-muted">
        Know the moment your site goes down — before your users do.
      </p>
    </div>
  );
}
