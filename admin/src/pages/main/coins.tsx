import { HomeLayout } from "@/layouts";
import { motion } from "framer-motion";
import {
  Coins as CoinsIcon,
  ArrowRightLeft,
  Gift,
  Plus,
  Loader,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";

export default function Coins() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(30);

  const presets = [30, 50, 100, 200];

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const res = await api.get("/user/me");
      setBalance(res.data.user?.coins ?? 0);
    } catch {
      toast.error("Failed to load coin balance");
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  /* ================= DAILY REWARD ================= */
  const handleClaim = async () => {
    try {
      setLoading(true);
      await api.post("/coins/claim");
      toast.success("Daily coins claimed");
      fetchBalance();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to claim daily reward"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= TRANSFER ================= */
  const handleTransfer = async () => {
    if (!recipient || amount < 30) {
      toast.error("Minimum transfer is 30 coins");
      return;
    }

    if (balance !== null && amount > balance) {
      toast.error("Insufficient coin balance");
      return;
    }

    try {
      setLoading(true);

      await api.post("/coins/transfer", {
        recipientEmail: recipient,
        amount,
      });

      toast.success(`Transferred ${amount} coins`);
      setRecipient("");
      setAmount(30);
      fetchBalance();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Coin transfer failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeLayout>
      <section className="main py-10 space-y-14 max-w-[980px]">
        {/* ================= HEADER ================= */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold font-space">
            My Coins
          </h1>
          <p className="text-muted text-sm">
            Manage your balance, rewards, and transfers.
          </p>
        </div>

        {/* ================= BALANCE ================= */}
        <div className="glass border border-line rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <p className="text-sm text-muted">Available Balance</p>

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CoinsIcon className="text-primary" />
              </div>

              {balance === null ? (
                <div className="flex items-center gap-2 text-muted">
                  <Loader size={18} className="animate-spin" />
                  <span className="text-sm">Loading</span>
                </div>
              ) : (
                <span className="text-4xl font-bold">
                  {balance} Coins
                </span>
              )}
            </div>

            <p className="text-muted text-sm">
              Coins are used for bot deployments and features
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/store")}
            className="btn-primary h-11 px-7 rounded-full flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} />
            Buy Coins
          </button>
        </div>

        {/* ================= DAILY REWARD ================= */}
        <div className="glass border border-line rounded-2xl p-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gift className="text-primary" />
            </div>

            <div>
              <p className="font-medium">Daily Reward</p>
              <p className="text-muted text-sm">
                Claim free coins once every 24 hours
              </p>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleClaim}
            className="
              h-9 px-5 rounded-full
              border border-line bg-secondary
              flex items-center justify-center
              text-sm leading-none
              hover:border-primary transition
              disabled:opacity-50
            "
          >
            {loading ? "Processing…" : "Claim Now"}
          </button>
        </div>

        {/* ================= TRANSFER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-line rounded-3xl p-8 space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ArrowRightLeft className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold">
              Transfer Coins
            </h2>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Recipient Email
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="user@example.com"
              className="w-full h-11 px-4 rounded-xl bg-background border border-line"
            />
          </div>

          {/* Amount */}
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Amount (minimum 30)
            </label>

            <input
              type="number"
              min={30}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-xl bg-background border border-line"
            />

            <div className="flex flex-wrap gap-3">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`
                    h-9 px-4 rounded-full border text-sm transition
                    ${
                      amount === p
                        ? "border-primary text-primary bg-primary/5"
                        : "border-line text-muted hover:border-primary/40"
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleTransfer}
            className="w-full h-11 rounded-full btn-primary text-sm disabled:opacity-50"
          >
            Transfer {amount} Coins
          </button>
        </motion.div>
      </section>
    </HomeLayout>
  );
}