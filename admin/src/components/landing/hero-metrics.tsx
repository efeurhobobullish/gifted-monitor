import { memo } from "react";
import { Server, Zap, Clock, Coins } from "lucide-react";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 border border-line rounded-lg bg-background/70">
      <Icon size={20} className="text-primary" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-main">{value}</p>
      </div>
    </div>
  );
}

const HeroMetrics = () => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <Stat icon={Server} label="Active Deployments" value="128" />
      <Stat icon={Zap} label="Uptime" value="99.98%" />
      <Stat icon={Clock} label="Avg Deploy Time" value="3.1s" />
      <Stat icon={Coins} label="Coins Used Today" value="8,420" />
    </div>
  );
};

export default memo(HeroMetrics);