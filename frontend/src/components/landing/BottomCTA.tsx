import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "../ui";

export default function BottomCTA() {
  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0A0A0F 0%, #0D1117 50%, #0A0A0F 100%)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] opacity-25 blur-3xl" />
      </div>

      <div className="main relative z-10 text-center">
        <ScrollAnimation from="left" amount={0.15} className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-space leading-tight">
            Start Optimized Your Crypto Investment With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Hit your best portfolio performance easily with us
          </p>
          <div>
            <button
              type="button"
              className="px-10 py-5 bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] text-white rounded-lg font-semibold text-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity active:scale-[0.99] glow-pink"
            >
              Let's Talk Now
              <ArrowRight size={24} />
            </button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
