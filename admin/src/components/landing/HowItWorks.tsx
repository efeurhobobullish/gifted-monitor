import { motion } from "framer-motion";
import { Wallet, Zap, Activity } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function Step({ icon, title, description, delay }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center space-y-4"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="inline-flex relative z-10 items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4"
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-bold text-primary-2">
        {title}
      </h3>

      <p className="text-muted text-sm max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      icon: <Wallet size={40} className="text-white" />,
      title: "Fund Your Wallet",
      description:
        "Purchase coins to power your deployments. Coins are consumed transparently based on runtime usage.",
      delay: 0,
    },
    {
      icon: <Zap size={40} className="text-white" />,
      title: "Deploy Your Bot",
      description:
        "Launch an isolated WhatsApp bot instance in seconds with managed infrastructure.",
      delay: 0.2,
    },
    {
      icon: <Activity size={40} className="text-white" />,
      title: "Monitor & Control",
      description:
        "Track uptime, logs, and coin usage in real time from your dashboard.",
      delay: 0.4,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 relative bg-gradient-to-b from-background to-secondary/50 backdrop-blur"
    >
      <div className="main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
            How EmpireHost Works
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            A simple and transparent flow to deploy and manage automation.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-primary/80 drop-shadow-2xl drop-shadow-primary" />

          {steps.map((step) => (
            <Step key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}