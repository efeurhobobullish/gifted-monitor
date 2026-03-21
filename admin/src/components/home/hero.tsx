import { Link } from "react-router-dom";
import HeroChart from "./hero-chart";
import { ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { ScrollAnimation } from "../ui";

export default function Hero() {
  return (
    <ScrollAnimation>
      <section className="grid md:grid-cols-2 grid-cols-1 gap-6 py-6 md:h-[400px] items-center main">
        
        {/* LEFT SIDE: User Data & Actions */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg text-main/80 font-medium flex items-center gap-2">
              Welcome back, Investor <span className="animate-pulse">👋</span>
            </h2>
            
            <div className="space-y-1">
              <p className="text-sm text-main/60">Total Portfolio Value</p>
              <h1 className="text-5xl md:text-6xl font-space font-bold text-main tracking-tight">
                $24,593<span className="text-primary">.00</span>
              </h1>
            </div>

            {/* PnL Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded-md flex items-center gap-1 border border-green-500/20">
                <TrendingUp size={16} />
                <span className="font-bold">+12.5%</span>
              </div>
              <span className="text-main/60">+$2,400.32 today</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <Link 
              to="/deposit" 
              className="btn flex-1 md:flex-none md:min-w-[180px] btn-primary h-12 px-6 rounded-full text-sm flex items-center justify-center gap-2"
            >
              <Wallet size={18} />
              Deposit
            </Link>

            <Link 
              to="/withdraw" 
              className="btn flex-1 md:flex-none md:min-w-[180px] bg-secondary hover:bg-secondary/80 px-4 h-12 border border-line rounded-full text-sm flex items-center justify-center gap-2 text-main"
            >
              <ArrowUpRight size={18} />
              Withdraw
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: Chart */}
        {/* Removed gradient/blur, made it a solid, neat card */}
        <div className="h-[300px] w-full bg-background border border-line rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-space font-medium text-main">Market Overview</h3>
                    <p className="text-xs text-main/60">BTC/USD Realtime</p>
                </div>
                <div className="bg-secondary px-3 py-1 rounded-full text-xs border border-line text-main">
                    Live
                </div>
            </div>
            
            {/* Chart Component */}
            <div className="flex-1 w-full h-full">
               <HeroChart theme="dark"/>
            </div>
        </div>

      </section>
    </ScrollAnimation>
  )
}