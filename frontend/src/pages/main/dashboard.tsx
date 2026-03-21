import { HomeLayout } from "@/layouts";
import { motion } from "framer-motion";
import {
  Bot,
  Activity,
  PauseCircle,
  Coins as CoinsIcon,
  Plus,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/config/api";
import useAuthStore from "@/store/useAuthStore";

/* ================= TYPES ================= */
interface DashboardStats {
  totalBots: number;
  activeBots: number;
  inactiveBots: number;
  coins: number;
  deployedSlots: number;
  totalSlots: number;
}

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bots, setBots] = useState<BotItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, botsRes] = await Promise.all([
        api.get("/bots/dashboard/overview"),
        api.get("/bots"),
      ]);

      setStats(statsRes.data.stats);
      setBots(botsRes.data.bots || []);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const action = async (
    fn: () => Promise<any>,
    successMsg: string
  ) => {
    try {
      await fn();
      toast.success(successMsg);
      fetchDashboard();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Action failed"
      );
    }
  };

  const deployed = stats?.deployedSlots ?? 0;
  const total = stats?.totalSlots ?? 0;
  const progress =
    total > 0 ? Math.min((deployed / total) * 100, 100) : 0;

  return (
    <HomeLayout>
      <section className="main py-10 space-y-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold font-space">
              Dashboard
            </h1>
            <p className="text-muted text-sm">
              Welcome back,{" "}
              <span className="font-medium">
                {user?.fullName || "User"}
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/templates")}
            className="btn-primary h-11 px-6 rounded-full flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Bot
          </button>
        </div>

        {/* ================= STATS ================= */}
        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Total Bots"
                value={stats.totalBots}
                icon={<Bot size={20} />}
                iconBg="bg-primary/10 text-primary"
                onClick={() => navigate("/dashboard/bots")}
              />

              <StatCard
                title="Active Bots"
                value={stats.activeBots}
                icon={<Activity size={20} />}
                iconBg="bg-green-500/10 text-green-500"
                onClick={() => navigate("/dashboard/bots")}
              />

              <StatCard
                title="Inactive Bots"
                value={stats.inactiveBots}
                icon={<PauseCircle size={20} />}
                iconBg="bg-amber-500/10 text-amber-500"
                onClick={() => navigate("/dashboard/bots")}
              />

              <StatCard
                title="Coins"
                value={stats.coins}
                icon={<CoinsIcon size={20} />}
                iconBg="bg-purple-500/10 text-purple-500"
                onClick={() => navigate("/dashboard/coins")}
              />
            </div>

            {/* ================= USAGE ================= */}
            <div className="glass border border-line rounded-2xl p-8 space-y-4">
              <h2 className="text-lg font-semibold">
                Deployment Usage
              </h2>

              <p className="text-muted text-sm">
                {deployed} of {total} slots used
              </p>

              <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* ================= RECENT BOTS ================= */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Recently Deployed Bots
          </h2>

          {bots.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-line rounded-2xl p-10 text-center space-y-4"
            >
              <Bot size={42} className="mx-auto text-muted" />
              <p className="text-muted text-sm">
                No bots deployed yet
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bots.slice(0, 3).map((bot) => (
                <motion.div
                  key={bot._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass border border-line rounded-2xl p-6 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {bot.name}
                      </p>
                      <p className="text-xs text-muted">
                        {bot.template}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bot.status === "running"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {bot.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {bot.actions.canStart && (
                      <button
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/start`
                              ),
                            "Bot started"
                          )
                        }
                        className="h-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center gap-2"
                      >
                        <Play size={14} />
                        Start
                      </button>
                    )}

                    {bot.actions.canStop && (
                      <button
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/stop`
                              ),
                            "Bot stopped"
                          )
                        }
                        className="h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center gap-2"
                      >
                        <Pause size={14} />
                        Stop
                      </button>
                    )}

                    {bot.actions.canRestart && (
                      <button
                        onClick={() =>
                          action(
                            () =>
                              api.post(
                                `/bots/${bot._id}/restart`
                              ),
                            "Bot restarted"
                          )
                        }
                        className="h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={14} />
                        Restart
                      </button>
                    )}

                    {bot.actions.canViewLogs && (
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/bots/${bot._id}/logs`
                          )
                        }
                        className="h-10 rounded-full border border-line bg-secondary text-muted flex items-center justify-center gap-2"
                      >
                        <FileText size={14} />
                        Logs
                      </button>
                    )}
                  </div>

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
                      className="h-10 w-full rounded-full bg-red-500/10 text-red-600 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </HomeLayout>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  title,
  value,
  icon,
  iconBg,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="border border-line rounded-2xl p-6 bg-background flex items-center justify-between cursor-pointer hover:border-primary transition"
    >
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}