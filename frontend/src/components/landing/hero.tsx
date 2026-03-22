import { Link } from "react-router-dom";
import HeroMetrics from "./hero-metrics";
import { ArrowRight, Rocket } from "lucide-react";
import { ScrollAnimation } from "../ui";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 py-8 md:grid-cols-2 md:min-h-[480px] main">
      <ScrollAnimation from="left">
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-space font-bold text-primary-2 md:text-5xl">
              Know when your sites go down —{" "}
              <span className="text-primary">before your users do</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-main/80">
              Gifted Monitor checks your URLs on a schedule, tracks uptime, and
              notifies you via WhatsApp, Telegram, or email when a monitor fails
              or recovers. Email verification at signup; you choose how you get
              alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary h-12 min-w-[200px] gap-2 rounded-full px-6 text-sm md:min-w-[280px]"
            >
              <Rocket size={18} className="shrink-0" />
              Start Monitoring Free
            </Link>

            <a
              href="#docs"
              className="btn flex h-12 min-w-[200px] items-center gap-2 rounded-full border border-line bg-secondary px-4 text-sm md:min-w-[250px]"
            >
              See Features
              <ArrowRight size={18} className="shrink-0" />
            </a>
          </div>
        </div>
      </ScrollAnimation>

      <ScrollAnimation from="right">
        <div className="p-1 sm:p-0">
          <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-widest text-muted sm:mb-4 sm:text-left">
            Uptime preview
          </p>
          <HeroMetrics />
        </div>
      </ScrollAnimation>
    </section>
  );
}
