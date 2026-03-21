import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Users,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

interface TechFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}


function TechFeature({ icon, title, description, delay }: TechFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="rounded-xl p-6 border border-line hover:border-primary transition-all"
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

export default function Technology() {
  const features = [
    {
      icon: <Brain size={32} />,
      title: "AI Trend Detection",
      description:
        "Built on advanced momentum mapping algorithms — our 'Vector' system identifies profitable swing patterns in real-time.",
      delay: 0,
    },
    {
      icon: <Shield size={32} />,
      title: "Risk Management",
      description:
        "Sophisticated risk optimization ensures your capital is protected while maximizing profit potential.",
      delay: 0.1,
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Trade Optimization",
      description:
        "Every trade is analyzed and optimized before execution, ensuring the best entry and exit points.",
      delay: 0.2,
    },
    {
      icon: <Users size={32} />,
      title: "Smart Copy Trading",
      description:
        "Sync with top-performing human traders — learn from the best and replicate their success automatically.",
      delay: 0.3,
    },
    {
      icon: <Activity size={32} />,
      title: "Real-time Analytics",
      description:
        "Track performance with advanced metrics and insights — know exactly how your trades are performing.",
      delay: 0.4,
    },
    {
      icon: <Zap size={32} />,
      title: "Automated Execution",
      description:
        "No manual intervention needed — the system handles analysis, execution, and strategy automatically.",
      delay: 0.5,
    },
  ];

  return (
    <section
      id="technology"
      className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-background to-secondary/50 backdrop-blur"
      
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-px h-64 bg-gradient-to-b from-primary via-primary to-transparent opacity-30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-px h-64 bg-gradient-to-b from-[#8B5CF6] to-transparent opacity-30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-[#FFD700] rounded-full glow-gold" />
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-[#FF10F0] rounded-full glow-pink" />
      </div>

      <div className="main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            Cutting-edge AI and algorithms working 24/7 to maximize your
            profits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <TechFeature key={feature.title} {...feature} />
          ))}
        </div>

        {/* Gradient Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#FF10F0] via-[#8B5CF6] via-[#FFD700] to-transparent"
        />
      </div>
    </section>
  );
}

