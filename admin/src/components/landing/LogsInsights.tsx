import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const insights = [
  "Quantisync's leap in DeFi intelligence",
  "NeuronVault's edge on volatility detection",
  "Metabridge: Scaling cross-chain analytics",
  "SentinelAI's integration with institutional desks",
];

export default function LogsInsights() {
  return (
    <section
      className="py-20 px-4 relative"
      style={{
        background:
          "linear-gradient(180deg, #0D1117 0%, #0A0A0F 50%, #0D1117 100%)",
      }}
    >
      <div className="main">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space">
              Our Logs & Insights
            </h2>
            <div className="glass rounded-xl p-4 border border-white/10 inline-block">
              <p className="text-sm text-gray-400">10K+ Crypto Assets insight</p>
            </div>
          </motion.div>

          {/* Right: Articles List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {insights.map((insight, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-4 glass rounded-xl border border-white/10 hover:border-[#FF10F0]/50 transition-all group"
              >
                <span className="text-white group-hover:text-[#FF10F0] transition-colors">
                  {insight}
                </span>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-[#FF10F0] group-hover:translate-x-2 transition-all"
                />
              </motion.a>
            ))}

            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 glass rounded-xl p-6 border-2 border-[#FF10F0]/50 hover:border-[#FF10F0] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white font-space">
                  Rebalancing in Real-Time
                </h3>
                <ExternalLink
                  size={20}
                  className="text-[#FF10F0] group-hover:scale-110 transition-transform"
                />
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Discover how our AI continuously adapts your portfolio to market changes.
              </p>
              <button className="text-[#FF10F0] font-semibold hover:underline flex items-center gap-2">
                Read More
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

