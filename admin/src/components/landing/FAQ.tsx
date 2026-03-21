import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ScrollAnimation } from "../ui";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is EmpireHost?",
    answer:
      "EmpireHost is a managed automation hosting platform that allows you to deploy and run WhatsApp bot instances without managing servers, uptime, or infrastructure manually.",
  },
  {
    question: "How does the coin system work?",
    answer:
      "EmpireHost uses a transparent coin-based system. Coins are deducted based on bot runtime and usage, so you only pay for the resources you actually consume.",
  },
  {
    question: "What can I deploy on EmpireHost?",
    answer:
      "You can deploy isolated WhatsApp bot instances with support for automation logic, group management, scheduled tasks, and external integrations.",
  },
  {
    question: "Do I need server or DevOps experience?",
    answer:
      "No. EmpireHost handles infrastructure, runtime management, restarts, and monitoring. You only focus on your bot logic and automation goals.",
  },
  {
    question: "Can I run multiple bots at the same time?",
    answer:
      "Yes. Depending on your available coin balance and plan, you can deploy and manage multiple bot instances simultaneously from your dashboard.",
  },
  {
    question: "Is my bot data isolated and secure?",
    answer:
      "Yes. Every bot instance runs in an isolated environment. Sessions, execution, and data are sandboxed to prevent interference between deployments.",
  },
  {
    question: "Can I monitor bot status and logs?",
    answer:
      "Yes. EmpireHost provides real-time status indicators, uptime tracking, and logs so you can monitor and troubleshoot your deployments easily.",
  },
  {
    question: "What happens when my coins run out?",
    answer:
      "When your coin balance is low or depleted, affected bot instances may pause. You can top up your wallet at any time to resume normal operation.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: FAQItem & { index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 px-4 relative main"
    >
      {/* Header */}
      <ScrollAnimation className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          Common questions about using EmpireHost and managing bot deployments.
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