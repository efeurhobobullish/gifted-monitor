import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BottomCTA() {
  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0F 0%, #0D1117 50%, #0A0A0F 100%)",
      }}
    >
      {/* Strong Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] opacity-30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="main relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-space leading-tight">
            Start Optimized Your Crypto Investment With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Hit your best portfolio performance easily with us
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="px-10 py-5 bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] text-white rounded-lg font-semibold text-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity glow-pink">
              Let's Talk Now
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

