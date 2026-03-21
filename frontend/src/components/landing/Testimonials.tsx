import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { ScrollAnimation } from "../ui";

const testimonials = [
  {
    quote:
      "We finally stopped learning about outages from angry users. Gifted Monitor pings our API and pages the right channel in minutes.",
    author: "Lead engineer",
    role: "SaaS product",
  },
  {
    quote:
      "Email OTP signup was painless, and Telegram alerts mean our on-call rotation actually sees incidents.",
    author: "Ops manager",
    role: "E‑commerce",
  },
  {
    quote:
      "Having WhatsApp and email options let compliance-heavy teams get alerts without exposing extra inboxes.",
    author: "Platform admin",
    role: "Fintech",
  },
];

export default function Testimonials() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="main">
        <ScrollAnimation className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
            Teams that care about uptime
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            Gifted Monitor is built for operators who need signal without running
            their own probe fleet.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-line rounded-2xl p-8 bg-secondary/50 backdrop-blur"
            >
              <Quote className="text-primary mb-4" size={28} />
              <p className="text-main text-sm leading-relaxed mb-6">
                {t.quote}
              </p>
              <div>
                <p className="font-semibold text-sm text-main">{t.author}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
