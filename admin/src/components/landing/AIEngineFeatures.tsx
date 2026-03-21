import { motion } from "framer-motion";
import { Cpu, TrendingUp, Search, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Smart Portfolio Optimizer",
    description:
      "AI rebalance your crypto portfolio real-time based on risk appetite, goals, and market data.",
    color: "from-blue-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Predict Market Trends",
    description:
      "Uncover AI-powered forecasts for token movement, volatility, and momentum shifts before they happen.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Search,
    title: "Scan the Market",
    description:
      "Explore tokenomics, sentiment scores, liquidity health, and chain activity across 500+ crypto assets.",
    badge: "96.7% Accuracy",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: AlertTriangle,
    title: "AI Risk Detector",
    description:
      "Identify signals of rug-pulls, pump-and-dump patterns. High-risk assets predictive analytics.",
    color: "from-red-500 to-orange-600",
  },
];

export default function AIEngineFeatures() {
  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0F 0%, #0D1117 50%, #0A0A0F 100%)",
      }}
    >
      <div className="main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space">
            Advanced AI Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cutting-edge technology powering your trading decisions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-2xl p-8 border border-white/10 hover:border-[#FF10F0]/50 transition-all relative overflow-hidden"
              >
                {/* Glowing Background Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 blur-2xl`}
                />

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {feature.badge && (
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF10F0] to-[#8B5CF6] text-white text-xs font-semibold">
                      {feature.badge}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white mb-3 font-space">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
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

