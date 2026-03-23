import { useState } from "react";
import { HomeLayout } from "@/layouts";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Coins,
  CreditCard,
  ReceiptText,
  Shield,
  User,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

type TabKey = "account" | "stats" | "billing" | "security" | "danger";

export default function Profile() {
  const authUser = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<TabKey>("account");

  const user = {
    fullName: authUser?.fullName || "User",
    email: authUser?.email || "user@example.com",
    username: authUser?.email?.split("@")[0] || "gifted-user",
    coins: authUser?.coins ?? 0,
    bots: 3,
    joined: "Jan 2025",
    plan: "Elite",
  };

  const tabs = [
    { key: "account", label: "Account", icon: User },
    { key: "stats", label: "Stats", icon: BarChart3 },
    { key: "billing", label: "Billing", icon: CreditCard },
    { key: "security", label: "Security", icon: Shield },
    { key: "danger", label: "Danger", icon: AlertTriangle },
  ] as const;

  return (
    <HomeLayout>
      <section className="main py-10 space-y-7">
        <div>
          <h1 className="font-space text-3xl font-bold">Profile & Billing</h1>
          <p className="mt-1 text-sm text-muted">
            Manage account details, plan, payments, and security in one place.
          </p>
          <span className="mt-2 inline-flex rounded-full border border-line bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
            Demo
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn h-9 rounded-lg border px-3 text-xs md:h-10 md:text-sm ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line bg-background text-muted hover:border-primary/40"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "account" && (
          <div className="rounded-2xl border border-line bg-background p-5 md:p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Account Information
            </h3>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <InfoField label="Full Name" value={user.fullName} />
              <InfoField label="Username" value={user.username} />
              <InfoField label="Email" value={user.email} />
              <InfoField label="Joined" value={user.joined} />
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <ProfileStatCard
              label="Coins"
              value={user.coins}
              icon={<Coins size={16} />}
              valueClassName="text-amber-500"
            />
            <ProfileStatCard
              label="Monitors"
              value={user.bots}
              icon={<Bot size={16} />}
              valueClassName="text-primary"
            />
            <ProfileStatCard
              label="Plan"
              value={user.plan}
              icon={<CreditCard size={16} />}
              valueClassName="text-green-500"
            />
            <ProfileStatCard
              label="Invoices"
              value="3"
              icon={<ReceiptText size={16} />}
              valueClassName="text-main"
            />
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-background p-5 md:p-6">
              <h3 className="text-base font-semibold">Current Plan</h3>
              <p className="mt-1 text-sm text-muted">Elite plan • Monthly billing</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary h-10 rounded-lg px-4 text-sm">
                  Upgrade Plan
                </button>
                <button className="btn h-10 rounded-lg border border-line bg-secondary px-4 text-sm text-muted">
                  Manage Subscription
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-background p-5 md:p-6">
              <h3 className="text-base font-semibold">Payment Method</h3>
              <p className="mt-3 text-sm text-muted">Visa ending in 4242</p>
              <p className="text-xs text-muted">Expires 10/28</p>
              <button className="btn mt-4 h-9 rounded-lg border border-line bg-secondary px-3 text-xs text-muted">
                Update Card
              </button>
            </div>

            <div className="rounded-2xl border border-line bg-background p-5 md:p-6">
              <h3 className="text-base font-semibold">Recent Invoices</h3>
              <div className="mt-4 space-y-2 text-sm">
                <InvoiceRow id="INV-2401" amount="$29.00" date="Jan 12, 2026" />
                <InvoiceRow id="INV-2312" amount="$29.00" date="Dec 12, 2025" />
                <InvoiceRow id="INV-2311" amount="$29.00" date="Nov 12, 2025" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="rounded-2xl border border-line bg-background p-5 md:p-6">
            <h3 className="text-base font-semibold">Security</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-line bg-foreground px-3 py-2">
                <span>Password</span>
                <button className="text-primary hover:underline">Change</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-line bg-foreground px-3 py-2">
                <span>Two-Factor Authentication</span>
                <button className="text-primary hover:underline">Enable</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5 md:p-6">
            <h3 className="text-base font-semibold text-red-500">Danger Zone</h3>
            <p className="mt-2 text-sm text-muted">
              These actions are irreversible. Proceed only when necessary.
            </p>
            <button className="mt-4 h-10 rounded-lg border border-red-500 px-4 text-sm font-medium text-red-500 hover:bg-red-500/10">
              Delete Account
            </button>
          </div>
        )}
      </section>
    </HomeLayout>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function ProfileStatCard({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-background p-5">
      <div className="mb-4 text-muted">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-space font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function InvoiceRow({
  id,
  amount,
  date,
}: {
  id: string;
  amount: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-foreground px-3 py-2">
      <div>
        <p className="font-medium">{id}</p>
        <p className="text-xs text-muted">{date}</p>
      </div>
      <p className="font-semibold">{amount}</p>
    </div>
  );
}