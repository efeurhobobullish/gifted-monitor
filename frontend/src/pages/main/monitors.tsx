import { HomeLayout } from "@/layouts";
import {
  Activity,
  AlertCircle,
  Bot,
  CheckCircle2,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/config/api";
import { ButtonWithLoader, InputWithoutIcon, Modal } from "@/components/ui";
import { AddMonitorModal } from "@/components/home";

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

const statusStyles: Record<MonitorItem["status"], { bg: string; text: string }> = {
  running: { bg: "bg-green-500/10", text: "text-green-600" },
  stopped: { bg: "bg-amber-500/10", text: "text-amber-600" },
  deploying: { bg: "bg-blue-500/10", text: "text-blue-600" },
  failed: { bg: "bg-red-500/10", text: "text-red-600" },
};

export default function MonitorsPage() {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState<MonitorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MonitorItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const getMonitorId = (monitor: MonitorItem) => String(monitor.id || monitor._id);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/monitors");
      setMonitors(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load monitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const action = async (fn: () => Promise<any>, successMsg: string) => {
    try {
      await fn();
      toast.success(successMsg);
      fetchMonitors();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Action failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!deletePassword.trim()) {
      toast.error("Password is required");
      return;
    }
    try {
      setDeleting(true);
      await api.delete(`/monitors/${getMonitorId(deleteTarget)}`, {
        data: { password: deletePassword },
      });
      toast.success("Monitor deleted");
      setDeleteTarget(null);
      setDeletePassword("");
      fetchMonitors();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const runningCount = useMemo(
    () => monitors.filter((m) => m.status === "running").length,
    [monitors],
  );
  const downCount = useMemo(
    () => monitors.filter((m) => m.status === "failed" || m.status === "stopped").length,
    [monitors],
  );
  const avgUptime = useMemo(() => {
    if (!monitors.length) return "0.0%";
    const values = monitors
      .map((m) => Number.parseFloat(String(m.uptime || "0")))
      .filter((num) => Number.isFinite(num));
    if (!values.length) return "0.0%";
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return `${avg.toFixed(1)}%`;
  }, [monitors]);

  return (
    <HomeLayout>
      <section className="main py-10 space-y-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-space text-3xl font-bold">Monitors</h1>
            <p className="mt-1 text-sm text-muted">
              Manage monitor status, uptime, and quick actions.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary h-9 self-start rounded-md px-3 text-xs md:h-11 md:rounded-xl md:px-5 md:text-sm"
          >
            <Plus size={16} />
            Add Monitor
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <MiniStatCard label="Total" value={monitors.length} icon={<Bot size={16} />} valueClassName="text-primary" />
          <MiniStatCard label="Online" value={runningCount} icon={<CheckCircle2 size={16} />} valueClassName="text-green-500" />
          <MiniStatCard label="Down" value={downCount} icon={<AlertCircle size={16} />} valueClassName="text-red-500" />
          <MiniStatCard label="Avg Uptime" value={avgUptime} icon={<Activity size={16} />} valueClassName="text-amber-500" />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-line bg-background p-8 text-sm text-muted">Loading monitors...</div>
        ) : monitors.length === 0 ? (
          <div className="rounded-2xl border border-line bg-background p-10 text-center space-y-4">
            <Bot size={42} className="mx-auto text-muted" />
            <h3 className="text-lg font-semibold">No monitors yet</h3>
            <p className="mx-auto max-w-md text-sm text-muted">Add your first monitor to start tracking uptime and response.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary h-11 rounded-xl px-8">
              Add First Monitor
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {monitors.map((monitor) => {
              const status = statusStyles[monitor.status];
              const uptime = Number.parseFloat(String(monitor.uptime || "0"));
              const safeUptime = Number.isFinite(uptime) ? uptime.toFixed(1) : "0.0";
              const monitorUrl = `${monitor.url || ""}${monitor.path || ""}` || "Monitor target";

              return (
                <div key={getMonitorId(monitor)} className="rounded-2xl border border-line bg-background p-4 md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${monitor.status === "running" ? "bg-green-500" : "bg-red-500"}`} />
                        <p className="font-semibold">{monitor.name}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted">{monitorUrl}</p>
                    </div>

                    <span className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold capitalize ${status.bg} ${status.text}`}>
                      {monitor.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-foreground p-3 text-xs md:grid-cols-4">
                    <MetaCell label="Status" value={monitor.status.toUpperCase()} />
                    <MetaCell label="Uptime" value={`${safeUptime}%`} />
                    <MetaCell label="Interval" value={`${monitor.interval_mins || 5}m`} />
                    <MetaCell label="Checked" value="just now" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                    <ActionButton
                      icon={<Play size={14} />}
                      label="Start"
                      className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      onClick={() =>
                        action(
                          () =>
                            api.put(`/monitors/${getMonitorId(monitor)}`, {
                              is_active: true,
                            }),
                          "Monitor started",
                        )
                      }
                    />
                    <ActionButton
                      icon={<Pause size={14} />}
                      label="Stop"
                      className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      onClick={() =>
                        action(
                          () =>
                            api.put(`/monitors/${getMonitorId(monitor)}`, {
                              is_active: false,
                            }),
                          "Monitor stopped",
                        )
                      }
                    />
                    <ActionButton
                      icon={<Bot size={14} />}
                      label="Details"
                      className="border border-line bg-secondary text-muted hover:border-primary hover:text-primary"
                      onClick={() =>
                        navigate(`/monitors/detail/?id=${getMonitorId(monitor)}`)
                      }
                    />
                    <button
                      onClick={() => setDeleteTarget(monitor)}
                      className="h-10 rounded-lg border border-red-500/30 bg-red-500/10 text-sm font-medium text-red-600 transition hover:bg-red-500/20"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Trash2 size={14} />
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => (deleting ? null : setDeleteTarget(null))}
          title="Delete Monitor"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted">
              This will permanently remove{" "}
              <span className="font-medium text-main">
                {deleteTarget?.name || "this monitor"}
              </span>
              . This action cannot be undone.
            </p>
            <InputWithoutIcon
              id="delete-password"
              type="password"
              label="Current password"
              placeholder="Enter your account password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeletePassword("");
                }}
                className="btn h-10 rounded-lg border border-line bg-secondary px-4 text-sm text-muted"
                disabled={deleting}
              >
                Cancel
              </button>
              <ButtonWithLoader
                loading={deleting}
                initialText="Delete Monitor"
                loadingText="Deleting..."
                onClick={confirmDelete}
                className="btn h-10 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600"
              />
            </div>
          </div>
        </Modal>
        <AddMonitorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreated={fetchMonitors}
        />
      </section>
    </HomeLayout>
  );
}

function MiniStatCard({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-background p-5">
      <div className="mb-4 text-muted">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-space font-bold ${valueClassName}`}>{value}</p>
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

function ActionButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
