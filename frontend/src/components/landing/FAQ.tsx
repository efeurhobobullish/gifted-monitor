import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  ScrollAnimation,
  scrollRevealFromIndex,
  scrollRevealStaggerDelay,
} from "../ui";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Gifted Monitor?",
    answer:
      "Gifted Monitor is an uptime monitoring service. It periodically checks your websites and APIs and notifies you when they fail or recover — so you can respond before users notice.",
  },
  {
    question: "How does signup and verification work?",
    answer:
      "You register with email and receive a one-time code by email to verify your account. Monitoring alerts are separate: you can enable WhatsApp, Telegram, and/or email for downtime notifications.",
  },
  {
    question: "What can I monitor?",
    answer:
      "HTTP and HTTPS endpoints with configurable methods (GET, HEAD, POST), intervals, and expectations. Use it for marketing sites, APIs, and internal services you need to trust.",
  },
  {
    question: "What are Starter, Elite, and Pro?",
    answer:
      "Starter includes up to 5 monitors with preset intervals (5, 10, 30, or 60 minutes). Elite allows up to 20 monitors with intervals 3, 5, 10, 30, or 60 minutes. Pro allows up to 100 monitors and adds 1-minute checks plus the same other presets. Only these preset intervals are available — no free-form custom minutes. Limits are enforced when you create or edit monitors.",
  },
  {
    question: "Do I need my own servers?",
    answer:
      "No. Checks run on Gifted Monitor infrastructure. You only add monitors and choose how you want to be notified.",
  },
  {
    question: "Can I use multiple alert channels?",
    answer:
      "Yes. You can enable WhatsApp, Telegram, and email alerts per your preferences. Telegram requires linking your chat id; WhatsApp uses the Meta Cloud API for alert templates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Accounts use JWT auth and hashed passwords. Follow best practices for API keys and tokens in your own deployments; we isolate tenant data in the app database.",
  },
  {
    question: "Where do I see status and history?",
    answer:
      "The dashboard shows monitor status, recent checks, and derived uptime where the backend exposes it — so you can troubleshoot patterns and response times.",
  },
  {
    question: "What if I need help?",
    answer:
      "Use the contact form on the live site or reach the team via the channels linked in the product README and footer.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: FAQItem & { index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ScrollAnimation
      from={scrollRevealFromIndex(index)}
      delay={scrollRevealStaggerDelay(index)}
      amount={0.15}
      className="rounded-xl border-2 bg-secondary border-line overflow-hidden w-full"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-6 text-left flex items-center justify-between"
      >
        <h3 className="flex-1 font-semibold font-raleway text-main text-sm md:text-base">
          {question}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={24} className="text-primary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="text-muted text-sm leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollAnimation>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 px-4 relative main"
    >
      {/* Header */}
      <ScrollAnimation from="up" className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          Common questions about using Gifted Monitor for uptime and alerts.
        </p>
      </ScrollAnimation>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} {...faq} index={index} />
        ))}
      </div>
    </section>
  );
}
