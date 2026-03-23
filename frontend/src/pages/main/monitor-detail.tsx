import { HomeLayout } from "@/layouts";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import api from "@/config/api";
import { useEffect, useState } from "react";

interface MonitorItem {
  id?: string | number;
  _id?: string | number;
  name: string;
  url?: string;
  path?: string | null;
  status: "running" | "stopped" | "deploying" | "failed";
  uptime?: string | number;
  interval_mins?: number;
}

export default function MonitorDetail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const monitorId = params.get("id") || "6";
  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState<MonitorItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/monitors");
        const list: MonitorItem[] = Array.isArray(data) ? data : [];
        const found = list.find(
          (item) => String(item.id || item._id) === String(monitorId),
        );
        setMonitor(found || null);
      } catch {
        setMonitor(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [monitorId]);

  const uptime = useMemo(() => {
    const raw = Number.parseFloat(String(monitor?.uptime || "0"));
    return Number.isFinite(raw) ? raw : 0;
  }, [monitor?.uptime]);

  const bars = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => index < Math.round((uptime / 100) * 30)),
    [uptime],
  );

  const isUp = monitor?.status === "running";

  return (
    <HomeLayout>
      <section className="main py-10 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/monitors")}
            className="btn h-9 rounded-lg border border-line bg-secondary px-3 text-xs text-muted"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-background p-8 text-sm text-muted">
            Loading monitor details...
          </div>
        ) : !monitor ? (
          <div className="rounded-2xl border border-line bg-background p-8 text-sm text-muted">
            Monitor not found.
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-background p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isUp ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <p className="font-semibold text-lg">{monitor.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted">{`${monitor.url || ""}${monitor.path || ""}`}</p>
              </div>

              <span
                className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold ${
                  isUp
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isUp ? "UP" : "DOWN"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-foreground p-3 text-xs md:grid-cols-4">
              <MetaCell label="Response" value="103ms" />
              <MetaCell label="Uptime" value={`${uptime.toFixed(1)}%`} />
              <MetaCell label="Interval" value={`${monitor.interval_mins || 5}m`} />
              <MetaCell label="Checked" value="4m ago" />
            </div>

            <div
              className="mt-3 grid gap-1"
              style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}
            >
              {bars.map((on, index) => (
                <span
                  key={index}
                  className={`h-3 rounded-[3px] ${on ? "bg-green-500" : "bg-foreground"}`}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => navigate(`/monitors/${monitor.id || monitor._id}/logs`)}
                className="btn h-8 rounded-lg border border-line bg-secondary px-3 text-xs text-muted"
              >
                View logs
              </button>
              <a
                href={`${monitor.url || ""}${monitor.path || ""}`.startsWith("http") ? `${monitor.url || ""}${monitor.path || ""}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn h-8 rounded-lg border border-line bg-secondary px-3 text-xs text-muted"
              >
                Open URL
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </section>
    </HomeLayout>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-main">{value}</p>
    </div>
  );
}
