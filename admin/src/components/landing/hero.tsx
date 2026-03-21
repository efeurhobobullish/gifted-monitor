import { Link } from "react-router-dom";
import HeroMetrics from "./hero-metrics";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "../ui";

export default function Hero() {
  return (
    <ScrollAnimation>
      <section className="grid md:grid-cols-2 grid-cols-1 gap-10 py-4 md:h-[500px] items-center main">
        {/* Left */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-space font-bold text-primary-2">
              Deploy and run automation the{" "}
              <span className="text-primary">smart way</span> with EmpireHost
            </h1>

            <p className="text-main/80 text-sm max-w-xl">
              EmpireHost lets you deploy, manage, and scale messaging bots using
              a secure coin-based system. No infrastructure stress, no manual
              setup — just reliable runtime, transparent usage, and full
              control.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="btn md:min-w-[250px] btn-primary h-12 px-6 rounded-full text-sm"
            >
              Get Started
            </Link>

            <a
              href="#how-it-works"
              className="btn h-12 md:min-w-[250px] bg-secondary px-4 border border-line rounded-full text-sm flex items-center gap-2"
            >
              How It Works
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="bg-gradient-to-br from-transparent via-transparent to-foreground h-[250px] md:h-[300px] backdrop-blur-sm border border-line p-4 rounded-lg">
          <HeroMetrics />
        </div>
      </section>
    </ScrollAnimation>
  );
}