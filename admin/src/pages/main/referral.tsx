import { Copy, Gift, Users, Coins, Loader } from "lucide-react";
import { HomeLayout } from "@/layouts";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "@/config/api";

/* =======================
   TYPES (MATCH BACKEND)
======================= */
interface ReferralStats {
  totalReferrals: number;
  totalCoinsEarned: number;
}

interface ReferralItem {
  _id: string;
  fullName: string;
  username: string | null;
  joinedAt: string;
  rewardCoins: number;
  status: "credited" | "pending";
}

export default function Referral() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalCoinsEarned: 0,
  });
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);

  const referralLink = referralCode
    ? `https://host.empiretech.net.ng/register?ref=${referralCode}`
    : "";

  /* =======================
     FETCH DATA
  ======================= */
  const fetchReferralData = async () => {
    try {
      setLoading(true);

      const [codeRes, statsRes, historyRes] = await Promise.all([
        api.get("/referrals/code"),
        api.get("/referrals/stats"),
        api.get("/referrals/history"),
      ]);

      setReferralCode(codeRes.data.referralCode);
      setStats(statsRes.data);
      setReferrals(historyRes.data.referrals || []);
    } catch (error) {
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  /* =======================
     COPY LINK
  ======================= */
  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied");
    } catch {
      toast.error("Failed to copy referral link");
    }
  };

  return (
    <HomeLayout>
      <section className="main py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold font-space">
            Referral Program
          </h1>
          <p className="text-muted text-sm max-w-xl">
            Invite users to EmpireHost and earn coins when they deploy bots using
            your referral.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            label="Total Referrals"
            value={stats.totalReferrals}
            icon={Users}
            loading={loading}
          />
          <StatCard
            label="Coins Earned"
            value={stats.totalCoinsEarned}
            icon={Coins}
            loading={loading}
          />
          <StatCard
            label="Reward Per User"
            value="+100 Coins"
            icon={Gift}
            loading={loading}
          />
        </div>

        {/* ================= REFERRAL LINK ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-line space-y-4"
        >
          <div>
            <h3 className="font-medium">Your Referral Link</h3>
            <p className="text-muted text-sm">
              Share this link. You earn coins when a user deploys a bot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-11 px-4 rounded-full border border-line bg-background flex items-center text-sm overflow-hidden">
              <span className="truncate">
                {loading ? "Loading..." : referralLink}
              </span>
            </div>

            <button
              onClick={handleCopy}
              disabled={loading}
              className="h-11 px-5 rounded-full border border-line bg-secondary flex items-center gap-2 text-sm font-medium hover:border-primary transition disabled:opacity-50"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
        </motion.div>

        {/* ================= REFERRALS LIST ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-line space-y-6"
        >
          <h3 className="font-medium">Your Referrals</h3>

          {!loading && referrals.length === 0 ? (
            <p className="text-sm text-muted">
              No referrals yet. Share your link to start earning.
            </p>
          ) : (
            <div className="space-y-4">
              {referrals.map((user) => (
                <div
                  key={user._id}
                  className="
                    flex items-center justify-between
                    border border-line rounded-xl
                    p-4 bg-background
                  "
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.fullName
                      )}`}
                      alt={user.fullName}
                      className="h-10 w-10 rounded-full border border-line"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted">
                        {user.username || "—"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      +{user.rewardCoins} coins
                    </p>
                    <p className="text-xs text-muted capitalize">
                      {user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ================= HOW IT WORKS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-line space-y-4"
        >
          <h3 className="font-medium">How Referrals Work</h3>

          <ul className="space-y-3 text-sm text-muted">
            <li>• Share your unique referral link.</li>
            <li>• New users sign up using your link.</li>
            <li>• When they deploy a bot, you earn +100 coins.</li>
            <li>• Coins can be used to deploy more bots.</li>
          </ul>
        </motion.div>
      </section>
    </HomeLayout>
  );
}

/* =======================
   STAT CARD
======================= */
 function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number | string;
  icon: any;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-line"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>

        <div className="min-h-[44px] flex flex-col justify-center">
          <p className="text-sm text-muted">{label}</p>

          {loading ? (
            <div className="flex items-center gap-2 text-muted">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Loading</span>
            </div>
          ) : (
            <p className="text-xl font-semibold">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}