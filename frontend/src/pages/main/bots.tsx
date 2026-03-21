import { HomeLayout } from "@/layouts";
import { motion } from "framer-motion";
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Trash2,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/config/api";

/* ================= TYPES ================= */
interface BotItem {
  _id: string;
  name: string;
  template: string;
  status: "running" | "stopped" | "deploying" | "failed";
  uptime: string;
  actions: {
    canStart: boolean;
    canStop: boolean;
    canRestart: boolean;
    canDelete: boolean;
    canViewLogs: boolean;
  };
}

/* ================= STATUS STYLES ================= */
const statusStyles: Record<
  BotItem["status"],
  { bg: string; text: string }
> = {
  running: {
    bg: "bg-green-500/10",
    text: "text-green-600",
  },
  stopped: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
  },
  deploying: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  },
  failed: {
    bg: "bg-red-500/10",
    text: "text-red-600",
  },
};

export default function MyBots() {
  const navigate = useNavigate();
  const [bots, setBots] = useState<BotItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bots");
      setBots(data.bots || []);
    } catch {
      toast.error("Failed to load bots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const action = async (
    fn: () => Promise<any>,
    successMsg: string
  ) => {
    try {
      await fn();
      toast.success(successMsg);
      fetchBots();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Action failed"
      );
    }
  };

  return (
    <HomeLayout>
      <section className="main py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold font-space">
              My Bots
            </h1>
            <p className="text-muted text-sm">
              Manage, monitor, and control your deployed bots
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/templates")}
            className="btn-primary h-11 px-6 rounded-full flex items-center gap-2"
          >
            <Plus size={16} />
            Deploy Bot
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          /* ===== SKELETON LOADER ===== */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass border border-line rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-foreground/20" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-foreground/20 rounded" />
                    <div className="h-3 w-1/2 bg-foreground/10 rounded" />
                  </div>
                </div>

                <div className="h-3 w-1/3 bg-foreground/10 rounded" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-full bg-foreground/10" />
                  <div className="h-10 rounded-full bg-foreground/10" />
                </div>

                <div className="h-10 w-full rounded-full bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : bots.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-line rounded-2xl p-10 text-center space-y-4"
          >
            <Bot size={42} className="mx-auto text-muted" />
            <h3 className="text-lg font-semibold">
              No bots deployed yet
            </h3>
            <p className="text-muted text-sm max-w-md mx-auto">
              Deploy your first bot to start automating tasks and
              workflows.
            </p>
            <button
              onClick={() =>
                navigate("/dashboard/templates")
              }
              className="btn-primary h-11 px-8 rounded-full"
            >
              Deploy Your First Bot
            </button>
          </motion.div>
        ) : (
          /* ===== BOTS GRID ===== */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => {
              const status = statusStyles[bot.status];

              return (
                <motion.div
                  key={bot._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass border border-line rounded-2xl p-6 space-y-5"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${status.bg} ${status.text}`}
                      >
                        <Bot size={18} />
                      </div>

                      <div>
                        <p className="font-semibold leading-tight">
                          {bot.name}
                        </p>
                        <p className="text-xs text-muted">
                          {bot.template}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${status.bg} ${status.text}`}
                    >
                      {bot.status}
                    </span>
                  </div>

                  {/* META */}
                  <p className="text-xs text-muted">
                    Uptime: {bot.uptime}
                  </p>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-2 gap-3">
                    {bot.actions.canStart && (
                      <ActionButton
                        icon={<Play size={14} />}
                        label="Start"
                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/start`
                              ),
                            "Bot started"
                          )
                        }
                      />
                    )}

                    {bot.actions.canStop && (
                      <ActionButton
                        icon={<Pause size={14} />}
                        label="Stop"
                        className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/stop`
                              ),
                            "Bot stopped"
                          )
                        }
                      />
                    )}

                    {bot.actions.canRestart && (
                      <ActionButton
                        icon={<RotateCcw size={14} />}
                        label="Restart"
                        className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/restart`
                              ),
                            "Bot restarted"
                          )
                        }
                      />
                    )}

                    {bot.actions.canViewLogs && (
                      <ActionButton
                        icon={<FileText size={14} />}
                        label="Logs"
                        className="border border-line bg-secondary text-muted hover:border-primary hover:text-primary"
                        onClick={() =>
                          navigate(
                            `/dashboard/bots/${bot._id}/logs`
                          )
                        }
                      />
                    )}
                  </div>

                  {/* DELETE */}
                  {bot.actions.canDelete && (
                    <button
                      onClick={() =>
                        action(
                          () =>
                            api.delete(
                              `/bots/${bot._id}`
                            ),
                          "Bot deleted"
                        )
                      }
                      className="h-10 w-full rounded-full flex items-center justify-center gap-2 text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={14} />
                      Delete Bot
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </HomeLayout>
  );
}

/* ================= ACTION BUTTON ================= */
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
      className={`h-10 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}