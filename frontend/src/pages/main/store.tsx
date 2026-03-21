import { HomeLayout } from "@/layouts";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import useAuthStore from "@/store/useAuthStore";
import { payWithPaystack } from "@/helpers/paystack";
import api from "@/config/api";
import ButtonWithLoader from "@/components/ui/ButtonWithLoader";

/* ================= PRICING ================= */
const COIN_PRICE = 10.5;
const SLOT_PRICE = 250;

const coinPackages = [
  { coins: 100 },
  { coins: 300 },
  { coins: 500, popular: true },
  { coins: 1000 },
];

const serverSlots = [
  { slots: 1 },
  { slots: 3 },
  { slots: 5, popular: true },
  { slots: 10 },
];

export default function Store() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"slots" | "coins">("slots");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!user) {
    return (
      <HomeLayout>
        <div className="main py-10 text-muted">
          Please log in to make a purchase.
        </div>
      </HomeLayout>
    );
  }

  /* ================= BUY COINS ================= */
  const buyCoins = (coins: number) => {
    const amount = coins * COIN_PRICE;
    setLoadingId(`coins-${coins}`);

    payWithPaystack({
      email: user.email,
      amount,
      onSuccess: async (reference: string) => {
        try {
          await api.post("/store/verify", {
            reference,
            type: "coins",
            quantity: coins,
          });

          toast.success(`${coins} coins added successfully`);
        } catch {
          toast.error("Payment verification failed");
        } finally {
          setLoadingId(null);
        }
      },
      onCancel: () => {
        toast.info("Payment cancelled");
        setLoadingId(null);
      },
    });
  };

  /* ================= BUY SLOTS ================= */
  const buySlots = (slots: number) => {
    const amount = slots * SLOT_PRICE;
    setLoadingId(`slots-${slots}`);

    payWithPaystack({
      email: user.email,
      amount,
      onSuccess: async (reference: string) => {
        try {
          await api.post("/store/verify", {
            reference,
            type: "slots",
            quantity: slots,
          });

          toast.success(`${slots} server slot(s) added`);
        } catch {
          toast.error("Payment verification failed");
        } finally {
          setLoadingId(null);
        }
      },
      onCancel: () => {
        toast.info("Payment cancelled");
        setLoadingId(null);
      },
    });
  };

  return (
    <HomeLayout>
      <section className="main py-10 space-y-12 max-w-[1100px]">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold font-space">Store</h1>
          <p className="text-muted text-sm">
            Buy coins or server slots to deploy and manage more bots.
          </p>
        </div>

        {/* TABS */}
        <div className="flex w-full max-w-sm rounded-full border border-line bg-secondary p-1">
          <button
            onClick={() => setActiveTab("slots")}
            className={`flex-1 h-10 rounded-full text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === "slots"
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Server size={16} />
            Server Slots
          </button>

          <button
            onClick={() => setActiveTab("coins")}
            className={`flex-1 h-10 rounded-full text-sm font-medium transition flex items-center justify-center gap-2 ${
              activeTab === "coins"
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Coins size={16} />
            Coins
          </button>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "slots" && (
            <motion.div
              key="slots"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {serverSlots.map((pkg) => {
                const id = `slots-${pkg.slots}`;
                const loading = loadingId === id;

                return (
                  <div
                    key={pkg.slots}
                    className={`relative glass rounded-2xl border p-6 flex flex-col justify-between transition hover:border-primary ${
                      pkg.popular ? "border-primary" : "border-line"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-4 py-1 rounded-full shadow">
                        Best Value
                      </span>
                    )}

                    <div className="space-y-3 text-center mt-2">
                      <p className="text-4xl font-semibold">{pkg.slots}</p>
                      <p className="text-sm text-muted">Server Slot(s)</p>
                      <p className="text-lg font-medium">
                        ₦{(pkg.slots * SLOT_PRICE).toLocaleString()}
                      </p>
                    </div>

                    <ButtonWithLoader
                      loading={loading}
                      initialText="Purchase"
                      loadingText="Processing..."
                      onClick={() => buySlots(pkg.slots)}
                      className="mt-6 h-11 w-full rounded-full bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2"
                    />
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "coins" && (
            <motion.div
              key="coins"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {coinPackages.map((pkg) => {
                const id = `coins-${pkg.coins}`;
                const loading = loadingId === id;

                return (
                  <div
                    key={pkg.coins}
                    className={`relative glass rounded-2xl border p-6 flex flex-col justify-between transition hover:border-primary ${
                      pkg.popular ? "border-primary" : "border-line"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-4 py-1 rounded-full shadow">
                        Popular
                      </span>
                    )}

                    <div className="space-y-3 text-center mt-2">
                      <p className="text-4xl font-semibold">{pkg.coins}</p>
                      <p className="text-sm text-muted">Coins</p>
                      <p className="text-lg font-medium">
                        ₦{(pkg.coins * COIN_PRICE).toLocaleString()}
                      </p>
                    </div>

                    <ButtonWithLoader
                      loading={loading}
                      initialText="Purchase"
                      loadingText="Processing..."
                      onClick={() => buyCoins(pkg.coins)}
                      className="mt-6 h-11 w-full rounded-full bg-primary text-white hover:bg-primary/90 transition flex items-center justify-center gap-2"
                    />
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </HomeLayout>
  );
}