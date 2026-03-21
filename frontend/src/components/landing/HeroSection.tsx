import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  PieChart,
  BarChart3,
  User,
  Coins,
} from "lucide-react";

export default function HeroSection() {
  const dashboardCards = [
    {
      icon: TrendingUp,
      value: "$1,948.12",
      label: "Profit",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Shield,
      value: "97.5%",
      label: "Success Rate",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Coins,
      value: "$27,942.65",
      label: "Total Balance",
      color: "from-purple-500 to-pink-600",
      large: true,
    },
    {
      icon: PieChart,
      value: "Balanced",
      label: "Investment Style",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: BarChart3,
      value: "$10,840",
      label: "This Month",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: User,
      value: "Active",
      label: "Personal Wallet",
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20"
      style={{
        background:
          "linear-gradient(135deg, #0D1117 0%, #0A0A0F 50%, #0D1117 100%)",
      }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF10F0] opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#8B5CF6] opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700] opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 main px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold font-space leading-tight"
              >
                <span className="text-white">Invest Crypto</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent">
                  Smarter With AI
                </span>
                <br />
                <span className="text-white">Assistant</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-400 max-w-xl"
              >
                Explore market opportunities and grow your portfolio with AI insights.
              </motion.p>
            </div>

            {/* CTA Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email here"
                className="flex-1 px-6 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#FF10F0] focus:outline-none transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-pink whitespace-nowrap">
                Subscribe For Free
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="grid grid-cols-3 gap-4 p-6 glass rounded-2xl border border-white/10 relative">
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`glass rounded-xl p-4 border border-white/10 hover:border-[#FF10F0]/50 transition-all ${
                      card.large ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {card.value}
                    </div>
                    <div className="text-xs text-gray-400">{card.label}</div>
                    {card.large && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Portfolio Value</span>
                          <span className="text-green-400">+12.5%</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

