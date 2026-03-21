import { motion } from "framer-motion";
import { Globe, CheckCircle2, Coins, Users, Cpu, TrendingUp } from "lucide-react";

const stats = [
  { icon: Globe, value: "50+", label: "Countries", color: "from-blue-500 to-cyan-600" },
  { icon: CheckCircle2, value: "97.5%", label: "Success Rate", color: "from-green-500 to-emerald-600" },
  { icon: Coins, value: "10K+", label: "Crypto Assets", color: "from-purple-500 to-pink-600" },
  { icon: Users, value: "10,000+", label: "Daily Traders", color: "from-orange-500 to-red-600" },
];

const aiFeatures = [
  {
    icon: TrendingUp,
    title: "Scan the Market",
    description: "Analyze more than 100 cryptocurrency and token in real-time.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Cpu,
    title: "Predictive Modeling",
    description: "Neural networks predict market trends with a 99% accuracy exceeding.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Signal Delivery",
    description: "Receive AI-driven buy/sell/hold alerts through web, email, telegram and our Community.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Optimization",
    description: "Your dashboard and more will be fine-tuned for your strategic preferences over time.",
    color: "from-yellow-500 to-orange-600",
  },
];

export default function RiskAppetites() {
  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0D1117 0%, #0A0A0F 50%, #0D1117 100%)",
      }}
    >
      <div className="main">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 font-space">
            Strategies For Different Risk Appetites.
          </h2>

          {/* Stats Cards in Grid with Central Icon */}
          <div className="relative mb-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {/* Central CPU Icon (overlaid) */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] flex items-center justify-center glow-pink"
              >
                <Cpu size={60} className="text-white" />
              </motion.div>

              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    <div className="glass rounded-xl p-6 border border-white/10 hover:border-[#FF10F0]/50 transition-all text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* AI Engine Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white font-space">
              The Optimized AI Engine
            </h3>
            <p className="text-gray-400 text-lg">
              Designed for rapid performance and crafted with precision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-6 border border-white/10 hover:border-[#FF10F0]/50 transition-all"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

