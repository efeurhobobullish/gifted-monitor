import { useState } from "react";
import { HomeLayout } from "@/layouts";
import {
  User,
  BarChart3,
  Shield,
  AlertTriangle,
  Coins,
  Bot,
} from "lucide-react";
import { motion } from "framer-motion";

type TabKey = "account" | "stats" | "security" | "danger";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabKey>("account");

  // mock user data – replace with API
  const user = {
    fullName: "Empire Tech",
    email: "empiretech@duck.com",
    username: "empiretech",
    coins: 52,
    bots: 3,
    joined: "Jan 2025",
  };

  const tabs = [
    { key: "account", label: "Account", icon: User },
    { key: "stats", label: "Stats", icon: BarChart3 },
    { key: "security", label: "Security", icon: Shield },
    { key: "danger", label: "Danger", icon: AlertTriangle },
  ] as const;

  return (
    <HomeLayout>
      <section className="main py-10 space-y-8">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-2xl font-semibold font-space">Profile</h1>
          <p className="text-muted text-sm">
            Manage your account, security, and activity.
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex flex-wrap gap-2 border-b border-line">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-main/70 hover:text-main"
                }`}
              >
                <Icon size={16} />
                {tab.label}

                {active && (
                  <motion.span
                    layoutId="profile-tab-indicator"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="space-y-6">
          {/* ---------- ACCOUNT ---------- */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 border border-line space-y-4"
            >
              <h3 className="font-medium">Account Information</h3>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>

                <div>
                  <p className="text-muted">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>

                <div>
                  <p className="text-muted">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div>
                  <p className="text-muted">Joined</p>
                  <p className="font-medium">{user.joined}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- STATS ---------- */}
          {activeTab === "stats" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 gap-6"
            >
              <div className="glass rounded-xl p-6 border border-line flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Coins size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted text-sm">Coins Balance</p>
                  <p className="text-xl font-semibold">{user.coins}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-line flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted text-sm">Active Bots</p>
                  <p className="text-xl font-semibold">{user.bots}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- SECURITY ---------- */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 border border-line space-y-4"
            >
              <h3 className="font-medium">Security</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Password</span>
                  <button className="text-primary hover:underline">
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <button className="text-primary hover:underline">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- DANGER ---------- */}
          {activeTab === "danger" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-6 border border-red-500/40 bg-red-500/5 space-y-4"
            >
              <h3 className="font-medium text-red-500">Danger Zone</h3>

              <p className="text-sm text-muted">
                These actions are irreversible. Proceed with caution.
              </p>

              <button className="px-5 h-11 rounded-full border border-red-500 text-red-500 font-medium hover:bg-red-500/10 transition-colors">
                Delete Account
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </HomeLayout>
  );
}