import { memo } from "react";

const BAR_HEIGHTS_PX = [
  28, 32, 30, 34, 29, 33, 31, 27, 32, 34, 30, 32, 33, 29, 10, 31, 33, 30, 32, 31,
];

function UptimeBarChart() {
  return (
    <div className="flex h-12 w-full items-end gap-[3px] rounded-xl bg-secondary/50 px-2 py-2">
      {BAR_HEIGHTS_PX.map((h, i) => (
        <div
          key={i}
          className={`min-w-0 flex-1 rounded-t-sm ${
            i === 14 ? "bg-red-500/90" : "bg-primary/85"
          }`}
          style={{ height: `${h}px`, maxHeight: "100%" }}
        />
      ))}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</p>
      <p
        className={`mt-1 font-mono text-sm font-semibold tabular-nums sm:text-base ${
          highlight ? "text-primary" : "text-main"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function HeroMetrics() {
  return (
    <div className="mx-auto w-full max-w-md select-none">
      <div className="rounded-2xl bg-secondary/40 p-4 shadow-sm sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-main">
              api.giftedtech.co.ke
            </p>
            <p className="mt-0.5 text-[11px] text-muted">HTTPS · GET</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            Up
          </span>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-y-4 sm:flex-nowrap">
          <Stat label="Response" value="185ms" />
          <Stat label="Uptime" value="99.9%" highlight />
          <Stat label="Interval" value="3m" />
          <Stat label="Checked" value="30" />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted">
            Last 24 hours
          </p>
          <UptimeBarChart />
        </div>
      </div>
    </div>
  );
}

export default memo(HeroMetrics);
