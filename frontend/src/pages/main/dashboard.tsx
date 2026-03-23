import { HomeLayout } from "@/layouts";
import {
  Bot,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddMonitorModal } from "@/components/home";

import api from "@/config/api";
import useAuthStore from "@/store/useAuthStore";

interface MonitorItem {
  id?: string | number;
  _id?: string | number;
  name: string;
  url?: string;
  path?: string | null;
  status: "running" | "stopped" | "deploying" | "failed";
  uptime?: string | number;
  interval_mins?: number;
  intervalMins?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [monitors, setMonitors] = useState<MonitorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/monitors");
      setMonitors(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalMonitors = monitors.length;
  const activeMonitors = monitors.filter((m) => m.status === "running").length;
  const inactiveMonitors = monitors.filter((m) => m.status !== "running").length;
  const deployed = totalMonitors;
  const total = user?.role === "admin" ? 100 : 20;
  const progress =
    total > 0 ? Math.min((deployed / total) * 100, 100) : 0;
  const remaining = Math.max(total - deployed, 0);

  const avgUptime = useMemo(() => {
    if (!monitors.length) return "0.0%";
    const values = monitors
      .map((item) => Number.parseFloat(String(item.uptime || "0")))
      .filter((num) => Number.isFinite(num));
    if (!values.length) return "0.0%";
    const avg =
      values.reduce((sum, value) => sum + value, 0) / values.length;
    return `${avg.toFixed(1)}%`;
  }, [monitors]);

  const allOnline = totalMonitors > 0 && inactiveMonitors === 0;

  return (
    <HomeLayout>
      <section className="main py-10 space-y-7">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-background px-4 py-3 md:px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Dashboard
            </p>
            <p className="mt-1 text-sm text-muted">
              Overview of monitor health and activity
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-space text-3xl font-bold">
              Welcome back, {user?.fullName || "User"}{" "}
              <span className="inline-block">👋</span>
            </h1>
            <p className="mt-1 text-sm text-muted">
              Here's what's happening with your monitors
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary h-8 self-start rounded-md px-3 text-xs md:h-11 md:rounded-xl md:px-5 md:text-sm"
          >
            <Plus size={16} />
            Add Monitor
          </button>
        </div>

        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            allOnline
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600"
          }`}
        >
          {loading
            ? "Loading monitor status..."
            : allOnline
            ? `All ${totalMonitors} monitor${
                totalMonitors === 1 ? " is" : "s are"
              } online and running smoothly`
            : `${inactiveMonitors} monitor${
                inactiveMonitors === 1 ? " is" : "s are"
              } currently down or paused`}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <DashboardStatCard
            title="TOTAL"
            value={totalMonitors}
            icon={<Bot size={16} />}
            valueClassName="text-primary"
          />
          <DashboardStatCard
            title="ONLINE"
            value={activeMonitors}
            icon={<CheckSquare size={16} />}
            valueClassName="text-green-500"
          />
          <DashboardStatCard
            title="DOWN"
            value={inactiveMonitors}
            icon={<AlertCircle size={16} />}
            valueClassName="text-red-500"
          />
          <DashboardStatCard
            title="AVG UPTIME"
            value={avgUptime}
            icon={<TrendingUp size={16} />}
            valueClassName="text-amber-500"
          />
        </div>

        <div className="rounded-2xl border border-line bg-background p-4">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
            <span>Monitor usage</span>
            <span>
              {deployed} / {total || 0}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {remaining} monitor{remaining === 1 ? "" : "s"} remaining
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Recent monitors
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-line bg-background p-8 text-sm text-muted">
              Loading monitors...
            </div>
          ) : (
            <div className="space-y-3">
              {monitors.slice(0, 5).map((bot) => (
                <RecentMonitorRow
                  key={String(bot.id || bot._id)}
                  bot={bot}
                  onOpen={() =>
                    navigate(`/monitors/detail/?id=${bot.id || bot._id}`)
                  }
                />
              ))}
            </div>
          )}
          {monitors.length === 0 && !loading && (
            <div className="rounded-2xl border border-line bg-background p-10 text-center">
              <Bot size={36} className="mx-auto text-muted" />
              <p className="mt-3 text-sm text-muted">
                No monitors added yet.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary mx-auto mt-5 h-10 rounded-lg px-4 text-sm"
              >
                Add your first monitor
              </button>
            </div>
          )}
        </div>
        <AddMonitorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreated={fetchDashboard}
        />
      </section>
    </HomeLayout>
  );
}

function DashboardStatCard({
  title,
  value,
  icon,
  valueClassName,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  valueClassName: string;
}) {
  return (
    <div
      className="rounded-2xl border border-line bg-background p-5"
    >
      <div className="mb-4 text-muted">{icon}</div>
      <p className="text-xs font-semibold tracking-wide text-muted">
        {title}
      </p>
      <p className={`mt-1 text-4xl font-space font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function RecentMonitorRow({
  bot,
  onOpen,
}: {
  bot: MonitorItem;
  onOpen: () => void;
}) {
  const isUp = bot.status === "running";
  const uptime = Number.parseFloat(String(bot.uptime || "0"));
  const safeUptime = Number.isFinite(uptime) ? uptime.toFixed(1) : "0.0";
  const monitorUrl = `${bot.url || ""}${bot.path || ""}` || "Monitor target";

  return (
    <div className="rounded-2xl border border-line bg-background p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isUp ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="font-semibold">{bot.name}</p>
          </div>
          <p className="mt-1 text-xs text-muted">{monitorUrl}</p>
        </div>

        <button
          onClick={onOpen}
          className="btn h-9 rounded-lg border border-line bg-secondary px-3 text-xs text-muted hover:border-primary"
        >
          Open
          <ExternalLink size={13} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-foreground p-3 text-xs md:grid-cols-4">
        <MetaCell label="Status" value={isUp ? "UP" : "DOWN"} />
        <MetaCell label="Uptime" value={`${safeUptime}%`} />
        <MetaCell label="Interval" value="5m" />
        <MetaCell label="Checked" value="just now" />
      </div>

      <div
        className="mt-3 grid gap-1"
        style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 30 }).map((_, index) => {
          const shade =
            index <
            Math.round((Number.parseFloat(safeUptime) / 100) * 30);
          return (
            <span
              key={`${bot.id || bot._id}-${index}`}
              className={`h-3 rounded-[3px] ${
                shade
                  ? isUp
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-foreground"
              }`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-right text-[11px] text-muted">
        30 checks
      </p>
    </div>
  );
}

function MetaCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-main">{value}</p>
    </div>
  );
}